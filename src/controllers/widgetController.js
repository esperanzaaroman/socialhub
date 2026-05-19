const WidgetModel = require('../models/widgetModel');

const createWidget = async(req,res) => {
    try {
        const {id_proyecto,id_metrica,id_plantilla,nombre_widget,ui_widget} = req.body;

        if (!id_metrica||!id_proyecto||!id_plantilla||!nombre_widget){
            return res.status(400).json({
                error:'Faltan campos obligatorios (id_proyecto,id_metrica,id_platilla,nombre_widget)'
            });

        }

        const newWidgetId = await WidgetModel.create(req.body);

        res.status(201).json({
            message: 'Widget creato con exito',
            id_widget: newWidgetId
        });
    } catch (error){

        console.error('Error en createWidget:', error);
        res.status(500).json({error: 'Error interno del servidor al creear el widget'});
    }
};
module.exports = {createWidget};