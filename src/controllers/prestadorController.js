const db = require('../config/db');
const asyncHandler = require('../middleware/asyncHandler');

const crearPrestadorIndividual = asyncHandler(async (req, res) => {
    const { id_proyecto, estatus, fecha_alta } = req.body;

    if (!id_proyecto) {
        return res.status(400).json({ error: 'El id_proyecto es obligatorio.' });
    }

    const [result] = await db.execute(
        `INSERT INTO proyecto_prestador (id_proyecto, estatus, fecha_alta) 
         VALUES (?, ?, ?)`,
        [id_proyecto, estatus || 'activo', fecha_alta || new Date()]
    );

    res.status(201).json({
        status: "success",
        message: 'Prestador registrado correctamente.',
        insertId: result.insertId
    });
});

const getPrestadoresPorProyecto = asyncHandler(async (req, res) => {
    const id_proyecto = req.params.id;

    const [rows] = await db.execute(
        `SELECT pp.*, p.periodo, p.estado AS estado_proyecto, p.nombre AS nombre_proyecto
         FROM proyecto_prestador pp
         JOIN proyecto p ON pp.id_proyecto = p.id_proyecto
         WHERE pp.id_proyecto = ?`,
        [id_proyecto]
    );

    res.json({ status: "success", data: rows });
});

const cargaMasivaPrestadores = asyncHandler(async (req, res) => {
    const { id_proyecto, prestadores } = req.body;

    if (!id_proyecto)
        return res.status(400).json({ error: 'El id_proyecto es obligatorio.' });
    if (!prestadores || !Array.isArray(prestadores) || prestadores.length === 0)
        return res.status(400).json({ error: 'No se proporcionaron prestadores válidos.' });

    const values = [];
    let sql = `INSERT INTO proyecto_prestador (id_proyecto, estatus, fecha_alta) VALUES `;

    prestadores.forEach((p, index) => {
        const estatus = p.estatus || p.Estatus || 'activo';
        const fecha   = p.fecha_alta || p.fecha || p.Fecha || new Date();
        sql += `(?, ?, ?)${index === prestadores.length - 1 ? '' : ', '}`;
        values.push(id_proyecto, estatus, fecha);
    });

    await db.execute(sql, values);

    res.status(201).json({
        status: "success",
        data: { insertados: prestadores.length },
        message: 'Lote de prestadores cargado exitosamente.'
    });
});

const getPrestadores = asyncHandler(async (req, res) => {
    const [rows] = await db.execute(
        `SELECT 
            pp.*,
            p.periodo,
            p.estado   AS estado_proyecto,
            p.nombre   AS nombre_proyecto,
            YEAR(pp.fecha_alta) AS anio
         FROM proyecto_prestador pp
         JOIN proyecto p ON pp.id_proyecto = p.id_proyecto`
    );

    res.json({ status: "success", data: rows });
});

module.exports = {
    getPrestadoresPorProyecto,
    cargaMasivaPrestadores,
    crearPrestadorIndividual,
    getPrestadores
};