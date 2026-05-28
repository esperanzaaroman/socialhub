const db = require('../config/db');

const ProyectoModel = {
    create: async (data) => {
        const query = `INSERT INTO proyecto (titulo,descripcion_corta,descripcion_larga,categoria,fecha_inicio,fecha_fin,preiodo,video_URL,estado,zona,id_beneficiario) 
        VALUES (?,?,?,?,?,?,?)`;
    }


}