const db = require('../config/db');

const TABLE = 'dashboard_widget';
const VALID_OPERACIONES = ['SUM', 'AVG', 'COUNT', 'MAX', 'MIN'];


const ID_METRICA_BENEFICIARIOS = 4;

const parseWidgetRow = (row) => {
    if (!row) return null;
    const parsed = { ...row };
    if (typeof parsed.ui_config === 'string') {
        try {
            parsed.ui_config = JSON.parse(parsed.ui_config);
        } catch {
            parsed.ui_config = {};
        }
    }
    return parsed;
};


const calcularValorWidget = async (widget) => {
    if (!widget.id_metrica || !widget.operacion) return null;

    if (widget.id_metrica === ID_METRICA_BENEFICIARIOS && widget.id_proyecto) {
        const [rows] = await db.execute(
            `SELECT COUNT(*) AS resultado FROM beneficiarios WHERE id_proyecto = ?`,
            [widget.id_proyecto]
        );
        return rows[0].resultado ?? 0;
    }

    const [rows] = await db.execute(
        `SELECT ${widget.operacion}(COALESCE(valor_decimal, valor_entero)) AS resultado
         FROM valores_metricas
         WHERE id_metrica = ?`,
        [widget.id_metrica]
    );
    return rows[0].resultado ?? 0;
};

const obtenerHistorial = async (widget) => {
    if (!widget.id_metrica) return [];

    if (widget.id_metrica === ID_METRICA_BENEFICIARIOS && widget.id_proyecto) {
        const [rows] = await db.execute(
            `SELECT 
                DATE(b.fecha_registro) AS fecha,
                COUNT(*) AS valor_decimal
             FROM beneficiarios b
             WHERE b.id_proyecto = ?
             GROUP BY DATE(b.fecha_registro)
             ORDER BY fecha ASC`,
            [widget.id_proyecto]
        );

        if (rows.length === 0) {
            const [total] = await db.execute(
                `SELECT COUNT(*) AS valor_decimal, NOW() AS fecha
                 FROM beneficiarios WHERE id_proyecto = ?`,
                [widget.id_proyecto]
            );
            return total;
        }

        return rows;
    }

    const [rows] = await db.execute(
        `SELECT valor_decimal, valor_entero, fecha
         FROM valores_metricas
         WHERE id_metrica = ?
         ORDER BY fecha ASC`,
        [widget.id_metrica]
    );

    return rows.map(r => ({
        fecha: r.fecha,
        valor_decimal: r.valor_decimal ?? r.valor_entero ?? 0
    }));
};

const WidgetModel = {
    isValidOperacion: (operacion) => VALID_OPERACIONES.includes(operacion),


    findAll: async ({ id_proyecto } = {}) => {
        let query = `
            SELECT 
                w.*,
                p.nombre     AS nombre_plantilla,
                p.id_visualizacion,
                v.tipo       AS tipo_visualizacion,
                mp.nombre    AS nombre_metrica,
                mp.unidad    AS unidad_metrica
            FROM ${TABLE} w
            LEFT JOIN plantilla          p  ON w.id_plantilla = p.id_plantilla
            LEFT JOIN visualizacion      v  ON p.id_visualizacion = v.id_visualizacion
            LEFT JOIN metricas_proyecto  mp ON w.id_metrica = mp.id_metrica
        `;
        const params = [];

        if (id_proyecto !== undefined) {
            query += ' WHERE w.id_proyecto = ?';
            params.push(id_proyecto);
        }

        query += ' ORDER BY w.id_widget ASC';

        const [rows] = await db.execute(query, params);

        await Promise.all(rows.map(async (widget) => {
            if (typeof widget.ui_config === 'string') {
                try { widget.ui_config = JSON.parse(widget.ui_config); }
                catch { widget.ui_config = {}; }
            }

            widget.valor_calculado = await calcularValorWidget(widget);
            widget.historial       = await obtenerHistorial(widget);
        }));

        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute(
            `SELECT * FROM ${TABLE} WHERE id_widget = ?`,
            [id]
        );
        return parseWidgetRow(rows[0]);
    },

    getByProyectoId: async (id_proyecto) => {
        const [rows] = await db.execute(
            `SELECT * FROM dashboard_widget WHERE id_proyecto = ?`,
            [id_proyecto]
        );
        return rows;
    },

    create: async (widgetData, connection = null) => {
        const query = `
            INSERT INTO ${TABLE}
            (id_proyecto, id_metrica, id_plantilla, operacion, nombre_widget, pos_x, pos_y, ancho, alto, ui_config)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const ejecutor = connection ? connection : db;
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
            typeof widgetData.ui_config === 'object'
                ? JSON.stringify(widgetData.ui_config)
                : (widgetData.ui_config ?? '{}')
        ];

        const [result] = await ejecutor.execute(query, values);
        return WidgetModel.findById(result.insertId);
    },

    update: async (id, widgetData) => {
        const fields = [];
        const values = [];

        const allowed = [
            'id_proyecto', 'id_metrica', 'id_plantilla',
            'operacion', 'nombre_widget',
            'pos_x', 'pos_y', 'ancho', 'alto', 'ui_config'
        ];

        for (const key of allowed) {
            if (widgetData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(
                    key === 'ui_config'
                        ? JSON.stringify(widgetData.ui_config)
                        : widgetData[key]
                );
            }
        }

        if (fields.length === 0) return WidgetModel.findById(id);

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
};

module.exports = WidgetModel;