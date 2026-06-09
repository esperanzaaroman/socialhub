const db = require('../config/db');

const CatalogoModel = {
    getCategorias: async () => {
        const [rows] = await db.execute("SELECT id_categoria, nombre FROM categoria");
        return rows;
    },
    
    getOds: async () => {
        const [rows] = await db.execute("SELECT id_ods, nombre FROM ods");
        return rows;
    },
    
    getLideresActivos: async () => {
        const sql = `
            SELECT l.id_lider, u.username, l.carrera, l.estado
            FROM lider l
            INNER JOIN usuario u ON l.id_lider = u.id_usuario
            WHERE l.estado = 'activo'
        `;
        const [rows] = await db.execute(sql);
        return rows;
    },
    getPoblaciones: async () =>{
        const [rows] = await db.execute("SELECT id_poblacion, nombre FROM poblacion_objetivo");
        return rows;
    }
};

module.exports = CatalogoModel;