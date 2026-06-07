const WidgetModel = require('../models/widgetModel');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const db = require('../config/db');

const parsePositiveInt = (value, fieldName) => {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new AppError(`${fieldName} debe ser un entero positivo`, 400);
    }
    return parsed;
};

const validateCreateBody = (body) => {
    const { id_proyecto, id_metrica, id_plantilla, nombre_widget, operacion } = body;

    if (!id_proyecto || !id_metrica || !id_plantilla || !nombre_widget) {
        throw new AppError(
            'Faltan campos obligatorios (id_proyecto, id_metrica, id_plantilla, nombre_widget)',
            400
        );
    }

    if (typeof nombre_widget !== 'string' || nombre_widget.trim() === '') {
        throw new AppError('nombre_widget debe ser un texto no vacío', 400);
    }

    if (operacion && !WidgetModel.isValidOperacion(operacion)) {
        throw new AppError(
            `operacion inválida. Valores permitidos: SUM, AVG, COUNT, MAX, MIN`,
            400
        );
    }
};

const validateUpdateBody = (body) => {
    const allowedKeys = [
        'id_proyecto', 'id_metrica', 'id_plantilla', 'operacion',
        'nombre_widget', 'pos_x', 'pos_y', 'ancho', 'alto', 'ui_config'
    ];

    const hasUpdate = allowedKeys.some((key) => body[key] !== undefined);
    if (!hasUpdate) {
        throw new AppError('Debes enviar al menos un campo para actualizar', 400);
    }

    if (body.nombre_widget !== undefined) {
        if (typeof body.nombre_widget !== 'string' || body.nombre_widget.trim() === '') {
            throw new AppError('nombre_widget debe ser un texto no vacío', 400);
        }
    }

    if (body.operacion && !WidgetModel.isValidOperacion(body.operacion)) {
        throw new AppError(
            `operacion inválida. Valores permitidos: SUM, AVG, COUNT, MAX, MIN`,
            400
        );
    }
};

// ─── GET /api/widgets?id_proyecto=X ──────────────────────────────────────────
// Ahora devuelve valor_calculado e historial en cada widget.
// El frontend puede usar estos datos directamente para KPIs y gráficas.
const getWidgets = asyncHandler(async (req, res) => {
    const filters = {};

    if (req.query.id_proyecto !== undefined) {
        filters.id_proyecto = parsePositiveInt(req.query.id_proyecto, 'id_proyecto');
    }

    // findAll ya trae valor_calculado e historial enriquecidos
    const widgets = await WidgetModel.findAll(filters);

    sendSuccess(res, {
        message: 'Widgets obtenidos correctamente',
        data: { widgets, total: widgets.length }
    });
});

// ─── GET /api/widgets/:id ─────────────────────────────────────────────────────
const getWidgetById = asyncHandler(async (req, res) => {
    const id = parsePositiveInt(req.params.id, 'id');
    const widget = await WidgetModel.findById(id);

    if (!widget) {
        throw new AppError('Widget no encontrado', 404);
    }

    sendSuccess(res, {
        message: 'Widget obtenido correctamente',
        data: { widget }
    });
});

const createWidgetDinamico = async (req, res) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const {
            id_proyecto, nombre_widget, id_plantilla,
            operacion, ui_config, infoMetrica, valores
        } = req.body;

        if (!infoMetrica) {
            connection.release();
            return res.status(400).json({ error: "Falta la información de la métrica (infoMetrica)." });
        }

        let idMetricaFinal;

        if (infoMetrica.tipo === 'nueva') {
            const [resultadoMetrica] = await connection.execute(
                `INSERT INTO metricas_proyecto (nombre, unidad, es_general) VALUES (?, ?, 0)`,
                [infoMetrica.nombre, infoMetrica.unidad || 'Unidades']
            );
            idMetricaFinal = resultadoMetrica.insertId;

        } else {
            idMetricaFinal = parseInt(infoMetrica.id_metrica, 10);
            if (isNaN(idMetricaFinal)) {
                connection.release();
                return res.status(400).json({ error: "El ID de la métrica existente es inválido." });
            }
        }

        const esBeneficiarios = (idMetricaFinal === 4);

        if (!esBeneficiarios && valores && valores.length > 0) {
            const queryValores = `
                INSERT INTO valores_metricas (id_metrica, valor_decimal, fecha)
                VALUES (?, ?, ?)
            `;
            for (const item of valores) {
                const fechaFormateada = new Date(item.fecha)
                    .toISOString().slice(0, 19).replace('T', ' ');

                await connection.execute(queryValores, [
                    idMetricaFinal,
                    item.valor,
                    fechaFormateada
                ]);
            }
        }

        const widgetPayload = {
            id_proyecto: parseInt(id_proyecto, 10),
            id_metrica: idMetricaFinal,
            id_plantilla: parseInt(id_plantilla, 10) || 1,
            operacion: operacion || 'SUM',
            nombre_widget: nombre_widget,
            ui_config: typeof ui_config === 'object' ? JSON.stringify(ui_config) : ui_config
        };

        const nuevoWidget = await WidgetModel.create(widgetPayload, connection);

        await connection.commit();

        return res.status(201).json({
            status: "success",
            message: "¡Widget y métricas procesadas exitosamente!",
            data: nuevoWidget
        });

    } catch (error) {
        await connection.rollback();
        console.error("Error crítico en la carga dinámica del backend:", error);
        return res.status(500).json({ error: "Fallo al procesar el flujo dinámico del widget." });
    } finally {
        connection.release();
    }
};

// ─── PUT /api/widgets/:id ─────────────────────────────────────────────────────
const updateWidget = asyncHandler(async (req, res) => {
    const id = parsePositiveInt(req.params.id, 'id');
    validateUpdateBody(req.body);

    const existing = await WidgetModel.findById(id);
    if (!existing) {
        throw new AppError('Widget no encontrado', 404);
    }

    const widget = await WidgetModel.update(id, req.body);

    sendSuccess(res, {
        message: 'Widget actualizado correctamente',
        data: { widget }
    });
});

// ─── PUT /api/widgets/layout ──────────────────────────────────────────────────
const guardarLayoutDashboard = asyncHandler(async (req, res) => {
    const { widgets } = req.body;

    if (!widgets || !Array.isArray(widgets)) {
        return res.status(400).json({ message: "Se esperaba un array de widgets" });
    }

    await Promise.all(
        widgets.map(w =>
            WidgetModel.update(w.id_widget, {
                pos_x: w.pos_x,
                pos_y: w.pos_y,
                ancho: w.ancho,
                alto: w.alto
            })
        )
    );

    return res.json({
        status: "success",
        message: "¡Layout del Dashboard actualizado correctamente!"
    });
});

// ─── DELETE /api/widgets/:id ──────────────────────────────────────────────────
const deleteWidget = asyncHandler(async (req, res) => {
    const id = parsePositiveInt(req.params.id, 'id');

    const deleted = await WidgetModel.delete(id);
    if (!deleted) {
        throw new AppError('Widget no encontrado', 404);
    }

    sendSuccess(res, {
        message: 'Widget eliminado correctamente',
        data: { id_widget: id }
    });
});

module.exports = {
    getWidgets,
    getWidgetById,
    createWidgetDinamico,
    updateWidget,
    deleteWidget,
    guardarLayoutDashboard
};