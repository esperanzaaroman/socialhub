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
        [
            id_proyecto, 
            estatus || 'Activo', 
            fecha_alta || new Date()
        ]
    );

    res.status(201).json({
        status: "success",
        message: 'Prestador registrado correctamente.',
        insertId: result.insertId
    });
});
// Obtener todos los prestadores por proyecto
const getPrestadoresPorProyecto = asyncHandler(async (req, res) => {
    const id_proyecto = req.params.id;

    const [rows] = await db.execute(
        `SELECT * FROM proyecto_prestador WHERE id_proyecto = ?`,
        [id_proyecto]
    );

    res.json({
        status: "success",
        data: rows
    });
});

// Carga masiva de prestadores por proyecto
const cargaMasivaPrestadores = asyncHandler(async (req, res) => {
    const { id_proyecto, prestadores } = req.body;

    if (!id_proyecto) {
        return res.status(400).json({ error: 'El id_proyecto es obligatorio.' });
    }
    if (!prestadores || !Array.isArray(prestadores) || prestadores.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron prestadores válidos.' });
    }

    const values = [];
    // Basado en tu formulario manual, asumimos estatus y fecha_alta (puedes agregar más)
    let sql = `INSERT INTO proyecto_prestador (id_proyecto, estatus, fecha_alta) VALUES `;

    prestadores.forEach((p, index) => {
        const estatus = p.estatus || p.Estatus || 'Activo';
        const fecha = p.fecha_alta || p.fecha || p.Fecha || new Date();

        sql += `(?, ?, ?)${index === prestadores.length - 1 ? '' : ', '}`;
        values.push(id_proyecto, estatus, fecha);
    });

    await db.execute(sql, values);

    res.status(201).json({
        status: "success",
        data: {
            insertados: prestadores.length
        },
        message: 'Lote de prestadores cargado exitosamente.'
    });
});

module.exports = {
    getPrestadoresPorProyecto,
    cargaMasivaPrestadores,
    crearPrestadorIndividual
};