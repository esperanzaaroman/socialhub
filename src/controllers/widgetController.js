const WidgetModel = require('../models/widgetModel');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const db = require('../config/db');

const WIDGETS_OBLIGATORIOS = [
    { id_metrica: 1, nombre_widget: 'Beneficiarios Totales', operacion: 'COUNT', color: '#6366f1', pos_x: 0 },
    { id_metrica: 2, nombre_widget: 'Prestadores Activos',   operacion: 'COUNT', color: '#10b981', pos_x: 4 },
    { id_metrica: 3, nombre_widget: 'Horas de Servicio',     operacion: 'SUM',   color: '#f59e0b', pos_x: 8 },
];

// 1 y 2 leen de tablas reales. 3 (horas) es valor numérico en valores_metricas,
// pero igual se excluye de la inserción automática de valores al crear widget.
const METRICAS_ESPECIALES = [1, 2, 3];

const parsePositiveInt = (value, fieldName) => {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isInteger(parsed) || parsed <= 0)
        throw new AppError(`${fieldName} debe ser un entero positivo`, 400);
    return parsed;
};

const validateUpdateBody = (body) => {
    const allowedKeys = [
        'id_proyecto', 'id_metrica', 'id_plantilla', 'operacion',
        'nombre_widget', 'pos_x', 'pos_y', 'ancho', 'alto', 'ui_config'
    ];
    if (!allowedKeys.some(k => body[k] !== undefined))
        throw new AppError('Debes enviar al menos un campo para actualizar', 400);

    if (body.nombre_widget !== undefined &&
        (typeof body.nombre_widget !== 'string' || body.nombre_widget.trim() === ''))
        throw new AppError('nombre_widget debe ser un texto no vacío', 400);

    if (body.operacion && !WidgetModel.isValidOperacion(body.operacion))
        throw new AppError('operacion inválida. Valores permitidos: SUM, AVG, COUNT, MAX, MIN', 400);
};

// ─── Seed widgets obligatorios al crear proyecto ──────────────────────────────
const seedWidgetsObligatorios = async (id_proyecto, connection = null) => {
    const ej = connection || db;
    for (const def of WIDGETS_OBLIGATORIOS) {
        const [existe] = await ej.execute(
            `SELECT id_widget FROM dashboard_widget
             WHERE id_proyecto = ? AND id_metrica = ? AND es_obligatorio = 1`,
            [id_proyecto, def.id_metrica]
        );
        if (existe.length > 0) continue;
        await ej.execute(
            `INSERT INTO dashboard_widget
             (id_proyecto, id_metrica, id_plantilla, operacion, nombre_widget,
              pos_x, pos_y, ancho, alto, ui_config, es_obligatorio)
             VALUES (?, ?, 1, ?, ?, ?, 0, 4, 3, ?, 1)`,
            [id_proyecto, def.id_metrica, def.operacion, def.nombre_widget,
             def.pos_x, JSON.stringify({ color: def.color })]
        );
    }
};

// ─── GET /api/widgets?id_proyecto=X ──────────────────────────────────────────
const getWidgets = asyncHandler(async (req, res) => {
    const filters = {};
    if (req.query.id_proyecto !== undefined)
        filters.id_proyecto = parsePositiveInt(req.query.id_proyecto, 'id_proyecto');

    const widgets = await WidgetModel.findAll(filters);
    sendSuccess(res, { message: 'Widgets obtenidos correctamente', data: { widgets, total: widgets.length } });
});

// ─── GET /api/widgets/metricas/:id_proyecto ───────────────────────────────────
// Devuelve todas las métricas vinculadas al proyecto (tengan widget o no)
const getMetricasByProyecto = asyncHandler(async (req, res) => {
    const id_proyecto = parsePositiveInt(req.params.id_proyecto, 'id_proyecto');

    const [rows] = await db.execute(
        `SELECT id_metrica, nombre, unidad, es_general
        FROM metricas_proyecto
        WHERE id_proyecto = ?
        ORDER BY nombre ASC`,
        [id_proyecto]
    );
    sendSuccess(res, { message: 'Métricas del proyecto obtenidas', data: { metricas: rows } });
});

// ─── GET /api/widgets/:id ─────────────────────────────────────────────────────
const getWidgetById = asyncHandler(async (req, res) => {
    const id = parsePositiveInt(req.params.id, 'id');
    const widget = await WidgetModel.findById(id);
    if (!widget) throw new AppError('Widget no encontrado', 404);
    sendSuccess(res, { message: 'Widget obtenido correctamente', data: { widget } });
});

// ─── POST /api/widgets ────────────────────────────────────────────────────────
const createWidgetDinamico = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { id_proyecto, nombre_widget, id_plantilla, operacion, ui_config, infoMetrica, valores } = req.body;

        if (!infoMetrica) {
            connection.release();
            return res.status(400).json({ error: 'Falta la información de la métrica (infoMetrica).' });
        }

        let idMetricaFinal;

        if (infoMetrica.tipo === 'nueva') {
            const [result] = await connection.execute(
                `INSERT INTO metricas_proyecto (nombre, unidad, es_general, id_proyecto) VALUES (?, ?, 0, ?)`,
                [infoMetrica.nombre, infoMetrica.unidad || 'Unidades', parseInt(id_proyecto, 10)]
            );
            idMetricaFinal = result.insertId;
        } else {
            idMetricaFinal = parseInt(infoMetrica.id_metrica, 10);
            if (isNaN(idMetricaFinal))
                return res.status(400).json({ error: 'El ID de la métrica existente es inválido.' });
        }

        // Vincular métrica al proyecto (si no es especial y no existe el vínculo)
        if (!METRICAS_ESPECIALES.includes(idMetricaFinal)) {
           await connection.execute(
                `UPDATE metricas_proyecto SET id_proyecto = ?
                WHERE id_metrica = ? AND id_proyecto IS NULL`,
                [parseInt(id_proyecto, 10), idMetricaFinal]
            );
        }

        // Insertar valores históricos solo para métricas normales
        if (!METRICAS_ESPECIALES.includes(idMetricaFinal) && valores && valores.length > 0) {
            for (const item of valores) {
                const fecha = new Date(item.fecha).toISOString().slice(0, 19).replace('T', ' ');
                await connection.execute(
                    `INSERT INTO valores_metricas (id_metrica, valor_decimal, fecha) VALUES (?, ?, ?)`,
                    [idMetricaFinal, item.valor, fecha]
                );
            }
        }

        const nuevoWidget = await WidgetModel.create({
            id_proyecto:  parseInt(id_proyecto, 10),
            id_metrica:   idMetricaFinal,
            id_plantilla: parseInt(id_plantilla, 10) || 1,
            operacion:    operacion || 'SUM',
            nombre_widget,
            ui_config: typeof ui_config === 'object' ? JSON.stringify(ui_config) : ui_config
        }, connection);

        await connection.commit();
        return res.status(201).json({
            status: 'success',
            message: '¡Widget y métricas procesadas exitosamente!',
            data: nuevoWidget
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error crítico en createWidgetDinamico:', error);
        return res.status(500).json({ error: 'Fallo al procesar el flujo dinámico del widget.' });
    } finally {
        connection.release();
    }
};

// ─── POST /api/widgets/:id/valores ───────────────────────────────────────────
// Agrega valores históricos a la métrica de un widget existente (desde editar)
// Funciona para métricas normales Y para las obligatorias (5 y 6 via sus tablas)
const agregarValorWidget = asyncHandler(async (req, res) => {
    const id_widget = parsePositiveInt(req.params.id, 'id_widget');
    const { valor, fecha, valores } = req.body; // valor+fecha = uno solo, valores = array CSV

    const widget = await WidgetModel.findById(id_widget);
    if (!widget) throw new AppError('Widget no encontrado', 404);

    const id_metrica  = widget.id_metrica;
    const id_proyecto = widget.id_proyecto;

    // Normalizar a array
    const items = valores
        ? valores
        : (valor !== undefined && fecha ? [{ valor, fecha }] : []);

    if (items.length === 0)
        throw new AppError('Debes enviar valor+fecha o un array valores[]', 400);

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        for (const item of items) {
            const v = parseFloat(item.valor);
            if (isNaN(v)) continue;

            const str = String(item.fecha).trim();
            let fechaFinal;
            const matchDMY = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
            if (matchDMY) {
                fechaFinal = `${matchDMY[3]}-${matchDMY[2].padStart(2,'0')}-${matchDMY[1].padStart(2,'0')} 00:00:00`;
            } else {
                fechaFinal = new Date(str.includes('T') ? str : `${str}T00:00:00`)
                    .toISOString().slice(0, 19).replace('T', ' ');
            }

            if (id_metrica === 6) {
                // Horas de servicio — insertar en horas_servicio
                // id_prestador requerido; si no viene usamos 0 (ajusta según tu auth)
                await connection.execute(
                    `INSERT INTO horas_servicio (id_proyecto, horas, fecha, descripcion)
                     VALUES (?, ?, ?, ?)`,
                    [id_proyecto, v, fechaFinal.slice(0, 10), item.descripcion || null]
                );
            } else {
                // Métricas normales + beneficiarios (4) → valores_metricas
                await connection.execute(
                    `INSERT INTO valores_metricas (id_metrica, valor_decimal, fecha) VALUES (?, ?, ?)`,
                    [id_metrica, v, fechaFinal]
                );
            }
        }

        await connection.commit();
        sendSuccess(res, { message: `${items.length} valor(es) registrado(s) correctamente` });

    } catch (err) {
        await connection.rollback();
        console.error('Error en agregarValorWidget:', err);
        throw new AppError('Error al registrar los valores', 500);
    } finally {
        connection.release();
    }
});

// ─── PUT /api/widgets/:id ─────────────────────────────────────────────────────
const updateWidget = asyncHandler(async (req, res) => {
    const id = parsePositiveInt(req.params.id, 'id');
    validateUpdateBody(req.body);

    const existing = await WidgetModel.findById(id);
    if (!existing) throw new AppError('Widget no encontrado', 404);

    if (existing.es_obligatorio) {
        delete req.body.id_metrica;
        delete req.body.id_plantilla;
        delete req.body.id_proyecto;
    }

    const widget = await WidgetModel.update(id, req.body);
    sendSuccess(res, { message: 'Widget actualizado correctamente', data: { widget } });
});

// ─── PUT /api/widgets/layout ──────────────────────────────────────────────────
const guardarLayoutDashboard = asyncHandler(async (req, res) => {
    const { widgets } = req.body;
    if (!widgets || !Array.isArray(widgets))
        return res.status(400).json({ message: 'Se esperaba un array de widgets' });

    await Promise.all(widgets.map(w =>
        WidgetModel.update(w.id_widget, { pos_x: w.pos_x, pos_y: w.pos_y, ancho: w.ancho, alto: w.alto })
    ));

    return res.json({ status: 'success', message: '¡Layout del Dashboard actualizado!' });
});

// ─── DELETE /api/widgets/:id ──────────────────────────────────────────────────
// Borra el widget pero NO la métrica ni sus valores (gracias al ON DELETE SET NULL)
const deleteWidget = asyncHandler(async (req, res) => {
    const id = parsePositiveInt(req.params.id, 'id');

    const existing = await WidgetModel.findById(id);
    if (!existing) throw new AppError('Widget no encontrado', 404);

    if (existing.es_obligatorio)
        throw new AppError('Este widget es obligatorio y no puede eliminarse', 403);

    await WidgetModel.delete(id);
    sendSuccess(res, { message: 'Widget eliminado. La métrica y sus datos históricos se conservan.', data: { id_widget: id } });
});

module.exports = {
    getWidgets,
    getWidgetById,
    getMetricasByProyecto,
    createWidgetDinamico,
    agregarValorWidget,
    updateWidget,
    deleteWidget,
    guardarLayoutDashboard,
    seedWidgetsObligatorios
};