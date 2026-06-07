const db = require('../config/db');


const getMetricasGenerales = async (req, res) => {
    try {
        const query = `SELECT id_metrica, nombre, unidad, es_general 
                       FROM metricas_proyecto 
                       WHERE es_general = 1 
                       ORDER BY nombre ASC`;
                       
        const [rows] = await db.execute(query);
        
        return res.status(200).json(rows);
    } catch (error) {
        console.error("❌ Error en getMetricasGenerales:", error);
        return res.status(500).json({ error: "Error interno al obtener las métricas generales." });
    }
};


const getMetricasPorProyecto = async (req, res) => {
    try {
        const idProyecto = req.params.id;

        if (!idProyecto) {
            return res.status(400).json({ error: "El ID del proyecto es requerido." });
        }

        const query = `
            SELECT DISTINCT m.id_metrica, m.nombre, m.unidad, m.es_general
            FROM metricas_proyecto m
            INNER JOIN dashboard_widget w ON m.id_metrica = w.id_metrica
            WHERE w.id_proyecto = ?
            ORDER BY m.nombre ASC
        `;

        const [rows] = await db.execute(query, [idProyecto]);

        return res.status(200).json(rows);
    } catch (error) {
        console.error("❌ Error en getMetricasPorProyecto:", error);
        return res.status(500).json({ error: "Error interno al obtener las métricas del proyecto." });
    }
};

module.exports = {
    getMetricasGenerales,
    getMetricasPorProyecto
};