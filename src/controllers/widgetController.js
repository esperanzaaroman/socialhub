const WidgetModel = require('../models/widgetModel');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');

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
        'id_proyecto',
        'id_metrica',
        'id_plantilla',
        'operacion',
        'nombre_widget',
        'pos_x',
        'pos_y',
        'ancho',
        'alto',
        'ui_config'
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

const getWidgets = asyncHandler(async (req, res) => {
    const filters = {};

    if (req.query.id_proyecto !== undefined) {
        filters.id_proyecto = parsePositiveInt(req.query.id_proyecto, 'id_proyecto');
    }

    const widgets = await WidgetModel.findAll(filters);

    sendSuccess(res, {
        message: 'Widgets obtenidos correctamente',
        data: { widgets, total: widgets.length }
    });
});

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

const createWidget = asyncHandler(async (req, res) => {
    validateCreateBody(req.body);

    const widget = await WidgetModel.create(req.body);

    sendSuccess(res, {
        statusCode: 201,
        message: 'Widget creado con éxito',
        data: { widget }
    });
});

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
const guardarLayoutDashboard = asyncHandler(async(req,res)=>{
    const{widgets} = req.body;

    if (!widgets || !Array.isArray(widgets)) {
        return res.status(400).json({ message: "Se esperaba un array de widgets" });
    }
    const promesasActualizacion = widgets.map(w => WidgetModel.update(w.id_widget,{
            pos_x: w.pos_x,
            pos_y: w.pos_y,
            ancho: w.ancho,
            alto: w.alto
        })
    );
    await Promise.all(promesasActualizacion);

    return res.json({
        status: "success",
        message: "¡Layout del Dashboard actualizado correctamente!" });
});
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
    createWidget,
    updateWidget,
    deleteWidget,
    guardarLayoutDashboard
};