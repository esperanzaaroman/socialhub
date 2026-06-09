const db = require('../config/db');

const ProyectoModel = {
    create: async (data) => {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();
        
            const query = `INSERT INTO proyecto (nombre,descripcion_corta,descripcion_larga,id_categoria,fecha_inicio,fecha_fin,periodo,video_URL,estado) 
            VALUES (?,?,?,?,?,?,?,?,?)`;
            const queryLi = 'INSERT INTO lider_proyecto (id_lider,id_proyecto) VALUES (?,?)';
            const queryReg = 'INSERT INTO registro_proyectos (id_proyecto,id_admin) VALUES (?,?)';
            const queryOds = 'INSERT INTO proyecto_ods (id_proyecto,id_ods) VALUES (?,?)';
            const queryPob = 'INSERT INTO poblacion_proyecto (id_poblacion,id_proyecto) VALUES (?,?)';
            const values = [data.titulo,data.descorta,data.desclarga,data.idcategoria,data.finicio,data.ffin,data.periodo,data.video,data.estado];
            const[result] = await connection.execute(query,values);

            const valuesLi = [data.id_lider,result.insertId];
            const valuesReg = [result.insertId,data.id_admin];
            const valuesOds = [result.insertId,data.ods];
            const valuesPob = [data.poblacion,result.insertId];

            await connection.execute(queryReg,valuesReg);
            await connection.execute(queryLi,valuesLi);
            await connection.execute(queryOds,valuesOds);
            await connection.execute(queryPob,valuesPob);
            await connection.commit();
            return result.insertId;
            
        } catch(err){
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
        

    },
    getAll: async()=>{
        const query = `SELECT * FROM vista_proyecto_completo`;
        const[rows] = await db.execute(query);
        return rows;
    },
    getById: async (id) => {
        const query = `SELECT * FROM vista_proyecto_completo WHERE id_proyecto = ?`;
        const[rows] = await db.execute(query,[id]);
        return rows[0];
    },


    update: async (id, data) => {
    const { nombre, descripcion_corta, estado } = data;
    await db.execute(
        `UPDATE proyecto SET nombre = ?, descripcion_corta = ?, estado = ? WHERE id_proyecto = ?`,
        [nombre, descripcion_corta, estado, id]
    );
    },

    getLideresByProyecto: async (id_proyecto) => {
    const [rows] = await db.execute(
        `
        SELECT
        u.id_usuario,
        u.username,
        u.foto_perfil,
        u.linkedin,
        l.carrera,
        lp.rol
        FROM lider_proyecto lp
        INNER JOIN usuario u
        ON u.id_usuario = lp.id_lider
        INNER JOIN lider l
        ON l.id_lider = lp.id_lider
        WHERE lp.id_proyecto = ?
        AND lp.estado = 'activo'
        `,
        [id_proyecto]
    );

    return rows;
    }

    };











module.exports = ProyectoModel;