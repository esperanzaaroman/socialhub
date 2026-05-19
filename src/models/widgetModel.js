const db = require('../config/db');

const WidgetModel = {
    create: async (widgetData) => {
        const query = 'INSERT INTO dashboard_widget (id_proyecto, id_metrica, id_plantilla,operacion,nombre_widget,pos_x,pos_y,ancho,alto,id_config) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';


        const values = [
            widgetData.id_proyecto,
            widgetData.id_metrica,  
            widgetData.id_plantilla,
            widgetData.operacion || 'SUM',
            widgetData.nombre_widget,
            widgetData.pos_x || 0,
            widgetData.pos_y || 0,
            widgetData.ancho || 4,
            widgetData.alto || 3,
            JSON.stringify(widgetData.id_config || {})
        ];  

        const [result] = await db.execute(query, values);
        return result.insertId;
    }
};

module.exports = WidgetModel;