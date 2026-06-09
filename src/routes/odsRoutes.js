const express = require('express');
const router  = express.Router();
const db      = require('../config/db');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler    = require('../middleware/asyncHandler');

// GET /api/ods/stats
// Devuelve todos los ODS con su conteo de proyectos y beneficiarios totales
router.get('/stats', asyncHandler(async (req, res) => {

    // Proyectos por ODS
    const [proyectosPorOds] = await db.execute(`
        SELECT
            o.id_ods,
            o.nombre,
            COUNT(DISTINCT po.id_proyecto) AS num_proyectos
        FROM ods o
        LEFT JOIN proyecto_ods po ON o.id_ods = po.id_ods
        GROUP BY o.id_ods, o.nombre
        ORDER BY num_proyectos DESC
    `);

    // Beneficiarios totales por ODS (a través de proyecto_ods → beneficiarios)
    const [beneficiariosporOds] = await db.execute(`
        SELECT
            o.id_ods,
            COUNT(DISTINCT b.id_beneficiario) AS num_beneficiarios
        FROM ods o
        LEFT JOIN proyecto_ods  po ON o.id_ods     = po.id_ods
        LEFT JOIN beneficiarios b  ON po.id_proyecto = b.id_proyecto
        GROUP BY o.id_ods
    `);

    // Merge
    const benMap = beneficiariosporOds.reduce((acc, r) => {
        acc[r.id_ods] = r.num_beneficiarios;
        return acc;
    }, {});

    const stats = proyectosPorOds
        .map(r => ({
            id_ods:           r.id_ods,
            nombre:           r.nombre,
            num_proyectos:    r.num_proyectos,
            num_beneficiarios: benMap[r.id_ods] || 0
        }))
        .filter(r => r.num_proyectos > 0); // solo ODS con al menos 1 proyecto

    sendSuccess(res, { message: 'Stats ODS obtenidas', data: { ods: stats } });
}));

module.exports = router;