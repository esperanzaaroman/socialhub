const db = require('../config/db');
const asyncHandler = require('../middleware/asyncHandler');
// Crear un solo beneficiario de forma manual
const crearBeneficiarioIndividual = asyncHandler(async (req, res) => {
    const { id_proyecto, nombre, genero, edad, fecha_registro } = req.body;

    if (!id_proyecto) {
        return res.status(400).json({ error: 'El id_proyecto es obligatorio.' });
    }

    const [result] = await db.execute(
        `INSERT INTO beneficiarios (id_proyecto, nombre, genero, edad, fecha_registro) 
         VALUES (?, ?, ?, ?, ?)`,
        [
            id_proyecto, 
            nombre || null, 
            genero || null, 
            edad || null, 
            fecha_registro || new Date()
        ]
    );

    res.status(201).json({
        status: "success",
        message: 'Beneficiario registrado correctamente.',
        insertId: result.insertId
    });
});

const getBeneficiariosPorProyecto = asyncHandler(async (req, res) => {
    const id_proyecto = req.params.id;

    const [rows] = await db.execute(
        `SELECT * FROM beneficiarios WHERE id_proyecto = ?`,
        [id_proyecto]
    );

    res.json({
        status: "success",
        data: rows
    });
});
const getBeneficiarios = asyncHandler(async(req,res)=>{
    const [rows] = await db.execute(
        'SELECT * FROM beneficiarios'
    );
    res.json({
        status: "success",
        data:rows
    })

})
// Carga masiva de beneficiarios por proyecto
const cargaMasivaBeneficiarios = asyncHandler(async (req, res) => {
    const { id_proyecto, beneficiarios } = req.body; 

    if (!id_proyecto) {
        return res.status(400).json({ error: 'El id_proyecto es obligatorio.' });
    }
    if (!beneficiarios || !Array.isArray(beneficiarios) || beneficiarios.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron beneficiarios válidos.' });
    }

    const values = [];
    let sql = `INSERT INTO beneficiarios (id_proyecto, nombre, genero, edad, fecha_registro) VALUES `;
    
    beneficiarios.forEach((b, index) => {
        const nombre = b.nombre || b.Nombre || null;
        const genero = b.genero || b.Genero || null;
        const edad = b.edad || b.Edad || null;
        const fecha = b.fecha_registro || b.fecha || b.Fecha || new Date();

        sql += `(?, ?, ?, ?, ?)${index === beneficiarios.length - 1 ? '' : ', '}`;
        values.push(id_proyecto, nombre, genero, edad, fecha);
    });

    await db.execute(sql, values);

    res.status(201).json({
        status: "success",
        data: {
            insertados: beneficiarios.length
        },
        message: 'Lote de beneficiarios cargado exitosamente.'
    });
});

module.exports = {
    getBeneficiariosPorProyecto,
    cargaMasivaBeneficiarios,
    crearBeneficiarioIndividual,
    getBeneficiarios
};