const db = require('../config/db');

const TABLE = 'dashboard_widget';
const VALID_OPERACIONES = ['SUM', 'AVG', 'COUNT', 'MAX', 'MIN'];


const parseWidgetRow = (row) => {
    if (!row) return null;
    const parsed = { ...row };
    if (typeof parsed.id_config === 'string') {
        try {
            parsed.id_config = JSON.parse(parsed.id_config);
        } catch {
            parsed.id_config = {};
        }
    }
    return parsed;
};

const WidgetModel = {
    isValidOperacion: (operacion) => VALID_OPERACIONES.includes(operacion),
    findAll: async ({ id_proyecto } = {}) => {
        let query = `SELECT w.*,
            p.nombre AS nombre_plantilla, 
            v.tipo AS tipo_visualizacion 
            FROM ${TABLE} w 
            LEFT JOIN plantilla p ON w.id_plantilla = p.id_plantilla
            LEFT JOIN visualizacion v ON p.id_visualizacion = v.id_visualizacion`;
        const params = [];

        if (id_proyecto !== undefined) {
            query += ' WHERE id_proyecto = ?';
            params.push(id_proyecto);
        }

        query += ' ORDER BY id_widget ASC';

        const [rows] = await db.execute(query, params);

        for (let widget of rows){
            if(widget.id_metrica && widget.operacion) {
                const sqlCalculo = `
                    SELECT ${widget.operacion}(COALESCE(valor_decimal,valor_entero)) AS resultado
                    FROM valores_metricas
                    WHERE id_metrica = ?
                `;
                const[resultadoCalculo] = await db.execute(sqlCalculo,[widget.id_metrica]);
                widget.valor_calculado = resultadoCalculo[0].resultado || 0;
            }else{
                widget.valor_calculado = null;
            }
        }
        return rows.map(parseWidgetRow);
    },

    findById: async (id) => {
        const [rows] = await db.execute(
            `SELECT * FROM ${TABLE} WHERE id_widget = ?`,
            [id]
        );
        return parseWidgetRow(rows[0]);
    },
    getByProyectoId: async (id_proyecto) => {
        const query = `SELECT * FROM dashboard_widget WHERE id_proyecto = ?`;
        const [rows] = await db.execute(query, [id_proyecto]);
        return rows;
    },
    create: async (widgetData) => {
        const query = `
            INSERT INTO ${TABLE}
            (id_proyecto, id_metrica, id_plantilla, operacion, nombre_widget, pos_x, pos_y, ancho, alto, id_config)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            widgetData.id_proyecto,
            widgetData.id_metrica,
            widgetData.id_plantilla,
            widgetData.operacion || 'SUM',
            widgetData.nombre_widget,
            widgetData.pos_x ?? 0,
            widgetData.pos_y ?? 0,
            widgetData.ancho ?? 4,
            widgetData.alto ?? 3,
            JSON.stringify(widgetData.id_config ?? {})
        ];

        const [result] = await db.execute(query, values);
        return WidgetModel.findById(result.insertId);
    },

    update: async (id, widgetData) => {
        const fields = [];
        const values = [];

        const allowed = [
            'id_proyecto',
            'id_metrica',
            'id_plantilla',
            'operacion',
            'nombre_widget',
            'pos_x',
            'pos_y',
            'ancho',
            'alto',
            'id_config'
        ];

        for (const key of allowed) {
            if (widgetData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(
                    key === 'id_config'
                        ? JSON.stringify(widgetData.id_config)
                        : widgetData[key]
                );
            }
        }

        if (fields.length === 0) {
            return WidgetModel.findById(id);
        }

        values.push(id);
        await db.execute(
            `UPDATE ${TABLE} SET ${fields.join(', ')} WHERE id_widget = ?`,
            values
        );

        return WidgetModel.findById(id);
    },

    delete: async (id) => {
        const [result] = await db.execute(
            `DELETE FROM ${TABLE} WHERE id_widget = ?`,
            [id]
        );
        return result.affectedRows > 0;
    },

    isValidOperacion: (operacion) => VALID_OPERACIONES.includes(operacion)
};

module.exports = WidgetModel;
