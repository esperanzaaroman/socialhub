const ProyectoModel = require('../models/proyectoModel');
const asyncHandler = require('../middleware/asyncHandler');
const db = require('../config/db');

const obtenerTodosLosProyectos = asyncHandler(async(req,res) => {
    const proyectos = await ProyectoModel.getAll();

    res.json(proyectos);
})

const createProyecto = async (req,res) => {
    try{
        req.body.id_admin = req.usuario.id;
        const {titulo,descorta,idcategoria} = req.body;

        if(!titulo||!descorta||!idcategoria){
            return res.status(400).json({error:'Faltan campos obligatorios'});

        }
        const id = await ProyectoModel.create(req.body);
        res.status(201).json({message: 'Proyecto creado',id_proyecto:id});

        }catch (error){
            console.error(error);
            res.status(500).json({error:'Error del servidor00'});


    }
};   

const getProyectoById = async (req,res) => {
    try{
        const id = req.params.id;

        let puedoEditar = false;

        if (req.usuario) {
            const idUsuario = req.usuario.id; 
            const rolUsuario = req.usuario.role; 

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
        if (!proyecto){

            return res.status(404).json({error:'Proyecto no encontrado'});

        }
        res.json({
            status: "success",
            data: {
                proyecto,
                puedoEditar
            }
        });
    }catch(error){
        console.error(error);
        res.status(500).json({error:'Error del Servidor'});
    }
};
const updateProyecto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion_corta, estado } = req.body;

        if (!nombre || !descripcion_corta || !estado) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        await ProyectoModel.update(id, { nombre, descripcion_corta, estado });
        res.json({ message: 'Proyecto actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

module.exports = {createProyecto, getProyectoById, obtenerTodosLosProyectos, updateProyecto};