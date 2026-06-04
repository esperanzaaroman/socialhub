const db = require('../config/db');

const ProyectoModel = {
    create: async (data) => {
        await db.beginTransaction();
        
        const query = `INSERT INTO proyecto (nombre,descripcion_corta,descripcion_larga,id_categoria,fecha_inicio,fecha_fin,periodo,video_URL,estado) 
        VALUES (?,?,?,?,?,?,?,?,?)`;
        const queryLi = 'INSERT INTO lider_proyecto (id_lider,id_proyecto) VALUES (?,?)';
        const queryReg = 'INSERT INTO registro_proyectos (id_proyecto,id_admin) VALUES (?,?)';
        const values = [data.titulo,data.desid_corta,data.desclarga,data.idcategoria,data.finicio,data.ffin,data.periodo,data.video,data.estado];
        const[result] = await db.execute(query,values);

        const valuesLi = [data.id_lider,result.insertId];
        const valuesReg = [result.insertyId,data.id_admin];

        await db.execute(queryReg,valuesReg);
        await db.execute(queryLi,valuesLi);

        await db.commit();
        return result.insertId;

    },
    getById: async (id) => {
        const query = 'SELECT * FROM proyecto WHERE id_proyecto = ?';
        const[rows] = await db.execute(query,[id]),
        return rows[0];
    }


}

module.exports = ProyectoModel;