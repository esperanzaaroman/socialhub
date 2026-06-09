const ProyectoModel = require('../models/proyectoModel');
const asyncHandler  = require('../middleware/asyncHandler');
const db            = require('../config/db');
const { seedWidgetsObligatorios } = require('./widgetController');

const obtenerTodosLosProyectos = asyncHandler(async (req, res) => {
    const proyectos = await ProyectoModel.getAll();
    res.json(proyectos);
});

const createProyecto = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        req.body.id_admin = req.usuario.id;
        const { titulo, descorta, idcategoria } = req.body;

        if (!titulo || !descorta || !idcategoria) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const id_proyecto = await ProyectoModel.create(req.body, connection);
        await seedWidgetsObligatorios(id_proyecto, connection);

        await connection.commit();
        res.status(201).json({ message: 'Proyecto creado', id_proyecto });

    } catch (error) {
        await connection.rollback();
        console.error('Error al crear proyecto:', error);
        res.status(500).json({ error: 'Error del servidor' });
    } finally {
        connection.release();
    }
};

const getProyectoById = async (req, res) => {
    try {
        const id = req.params.id;
        let puedoEditar = false;

        if (req.usuario) {
            const { id: idUsuario, role: rolUsuario } = req.usuario;
            if (rolUsuario === 'admin') {
                puedoEditar = true;
            } else if (rolUsuario === 'lider') {
                const [esAsignado] = await db.execute(
                    `SELECT 1 FROM lider_proyecto WHERE id_proyecto = ? AND id_lider = ?`,
                    [id, idUsuario]
                );
                puedoEditar = esAsignado.length > 0;
            }
        }

        const proyecto = await ProyectoModel.getById(id);
        if (!proyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });

        res.json({ status: 'success', data: { proyecto, puedoEditar } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error del Servidor' });
    }
};

async function getLideresByProyecto(req, res) {
  try {
    const lideres =
      await ProyectoModel.getLideresByProyecto(req.params.id);

    res.json(lideres);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: 'Error obteniendo líderes del proyecto'
    });
  }
}
module.exports = {createProyecto,getProyectoById,obtenerTodosLosProyectos,getBeneficiariosCount, getLideresByProyecto};
const getBeneficiariosCount = asyncHandler(async (req, res) => {
    const id_proyecto = parseInt(req.params.id, 10);
    const [rows] = await db.execute(
        `SELECT COUNT(*) AS total FROM beneficiarios WHERE id_proyecto = ?`,
        [id_proyecto]
    );
    res.json({ status: 'success', data: { total: rows[0].total, id_proyecto } });
});

module.exports = { createProyecto, getProyectoById, obtenerTodosLosProyectos, getBeneficiariosCount };
