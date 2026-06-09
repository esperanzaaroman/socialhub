const db = require('../config/db');

const TABLE = 'dashboard_widget';
const VALID_OPERACIONES = ['SUM', 'AVG', 'COUNT', 'MAX', 'MIN'];

const QUERY_COMPLETA = `
    SELECT 
        w.*,
        p.nombre        AS nombre_plantilla,
        p.id_visualizacion,
        v.tipo          AS tipo_visualizacion,
        mp.nombre       AS nombre_metrica,
        mp.unidad       AS unidad_metrica
    FROM dashboard_widget w
    LEFT JOIN plantilla          p  ON w.id_plantilla = p.id_plantilla
    LEFT JOIN visualizacion      v  ON p.id_visualizacion = v.id_visualizacion
    LEFT JOIN metricas_proyecto  mp ON w.id_metrica = mp.id_metrica
`;

const parseWidgetRow = (row) => {
    if (!row) return null;
    const parsed = { ...row };
    if (typeof parsed.ui_config === 'string') {
        try { parsed.ui_config = JSON.parse(parsed.ui_config); }
        catch { parsed.ui_config = {}; }
    }
    return parsed;
};

const calcularValorWidget = async (widget) => {
    if (!widget.id_metrica || !widget.operacion) return null;

    switch (widget.id_metrica) {
        case 1: {
            // Beneficiarios — COUNT directo de la tabla beneficiarios
            const [rows] = await db.execute(
                `SELECT COUNT(*) AS resultado FROM beneficiarios WHERE id_proyecto = ?`,
                [widget.id_proyecto]
            );
            return rows[0].resultado ?? 0;
        }
        case 2: {
            const [rows] = await db.execute(
                `SELECT COUNT(*) AS resultado
                 FROM proyecto_prestador
                 WHERE id_proyecto = ?`,
                [widget.id_proyecto]
            );
            return rows[0].resultado ?? 0;
        }
        case 3: {
            // Horas de servicio — valor numérico en valores_metricas (SUM normal)
            const [rows] = await db.execute(
                `SELECT COALESCE(SUM(valor_decimal), 0) AS resultado
                 FROM valores_metricas
                 WHERE id_metrica = ?`,
                [widget.id_metrica]
            );
            return rows[0].resultado ?? 0;
        }
        default: {
            // Métricas normales del proyecto
            const [rows] = await db.execute(
                `SELECT ${widget.operacion}(COALESCE(valor_decimal, valor_entero)) AS resultado
                 FROM valores_metricas
                 WHERE id_metrica = ?`,
                [widget.id_metrica]
            );
            return rows[0].resultado ?? 0;
        }
    }
};

const obtenerHistorial = async (widget) => {
    if (!widget.id_metrica) return [];

    switch (widget.id_metrica) {
        case 1: {
            const agrupacion = widget.ui_config?.agrupacion_beneficiarios || 'fecha';

            if (agrupacion === 'genero') {
                const [rows] = await db.execute(
                    `SELECT COALESCE(genero, 'sin_dato') AS label, COUNT(*) AS valor_decimal
                     FROM beneficiarios WHERE id_proyecto = ?
                     GROUP BY genero ORDER BY valor_decimal DESC`,
                    [widget.id_proyecto]
                );
                return rows;
            }

            if (agrupacion === 'edad') {
                const [rows] = await db.execute(
                    `SELECT
                         CASE
                             WHEN edad IS NULL            THEN 'Sin dato'
                             WHEN edad < 13               THEN '0-12'
                             WHEN edad BETWEEN 13 AND 17  THEN '13-17'
                             WHEN edad BETWEEN 18 AND 25  THEN '18-25'
                             WHEN edad BETWEEN 26 AND 35  THEN '26-35'
                             WHEN edad BETWEEN 36 AND 50  THEN '36-50'
                             WHEN edad BETWEEN 51 AND 65  THEN '51-65'
                             ELSE '65+'
                         END AS label,
                         COUNT(*) AS valor_decimal
                     FROM beneficiarios WHERE id_proyecto = ?
                     GROUP BY label ORDER BY MIN(COALESCE(edad, 999)) ASC`,
                    [widget.id_proyecto]
                );
                return rows;
            }

            // 'fecha' — default
            const [rows] = await db.execute(
                `SELECT DATE(fecha_registro) AS fecha, COUNT(*) AS valor_decimal
                 FROM beneficiarios
                 WHERE id_proyecto = ?
                 GROUP BY DATE(fecha_registro)
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
        case 2: {
            const [rows] = await db.execute(
                `SELECT DATE(fecha_alta) AS fecha, COUNT(*) AS valor_decimal
                 FROM proyecto_prestador
                 WHERE id_proyecto = ?
                 GROUP BY DATE(fecha)
                 ORDER BY fecha ASC`,
                [widget.id_proyecto]
            );
            return rows;
        }
        case 3:
        default: {
            // Horas y métricas normales — historial de valores_metricas
            const [rows] = await db.execute(
                `SELECT fecha, valor_decimal, valor_entero
                 FROM valores_metricas
                 WHERE id_metrica = ?
                 ORDER BY fecha ASC`,
                [widget.id_metrica]
            );
            return rows.map(r => ({
                fecha: r.fecha,
                valor_decimal: r.valor_decimal ?? r.valor_entero ?? 0
            }));
        }
    }
};

const enriquecerWidget = async (widget) => {
    if (typeof widget.ui_config === 'string') {
        try { widget.ui_config = JSON.parse(widget.ui_config); }
        catch { widget.ui_config = {}; }
    }
    widget.valor_calculado = await calcularValorWidget(widget);
    widget.historial       = await obtenerHistorial(widget);
    return widget;
};

const WidgetModel = {
    isValidOperacion: (op) => VALID_OPERACIONES.includes(op),

    findAll: async ({ id_proyecto } = {}) => {
        let query = QUERY_COMPLETA;
        const params = [];
        if (id_proyecto !== undefined) {
            query += ' WHERE w.id_proyecto = ?';
            params.push(id_proyecto);
        }
        query += ' ORDER BY w.id_widget ASC';
        const [rows] = await db.execute(query, params);
        await Promise.all(rows.map(enriquecerWidget));
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute(
            QUERY_COMPLETA + ' WHERE w.id_widget = ?',
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
        const ejecutor = connection || db;
        const [result] = await ejecutor.execute(
            `INSERT INTO ${TABLE}
             (id_proyecto, id_metrica, id_plantilla, operacion, nombre_widget,
              pos_x, pos_y, ancho, alto, ui_config)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
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
            ]
        );
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
            `DELETE FROM ${TABLE} WHERE id_widget = ?`, [id]
        );
        return result.affectedRows > 0;
    },
};

module.exports = WidgetModel;