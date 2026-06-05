const ProyectoModel = require('../models/proyectoModel');


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
        const proyecto = await ProyectoModel.getById(id);
        if (!proyecto){

            return res.status(404).json({error:'Proyecto no encontrado'});

        }
        res.json(proyecto);
    }catch(error){
        console.error(error);
        res.status(500).json({error:'Error del Servidor'});
    }
};
module.exports = {createProyecto,getProyectoById};