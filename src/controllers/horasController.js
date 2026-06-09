const db = require('../config/db');
const asyncHandler = require('../middleware/asyncHandler');

const getHorasPorProyecto = asyncHandler(async (req, res) => {
    const id_proyecto = req.params.id;

    const [rows] = await db.execute(
        `SELECT * FROM horas_proyecto WHERE id_proyecto = ?`,
        [id_proyecto]
    );

    res.json({
        status: "success",
        data: rows
    });
});


const getHoras = asyncHandler(async (req, res) => {
     const [rows] = await db.execute(
        `SELECT 
            h.*,
            p.periodo,
            p.estado   AS estado_proyecto,
            YEAR(h.fecha) AS anio
         FROM horas_proyecto h
         JOIN proyecto p ON h.id_proyecto = p.id_proyecto`,
    );

    res.json({
        status: "success",
        data: rows
    });

});
module.exports = {
    getHoras,
    getHorasPorProyecto
};