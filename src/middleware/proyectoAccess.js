const db = require('../config/db');
const AppError = require('../utils/AppError');

const verificarLiderDelProyecto = async (req,res,next) => {
    try{
        const idUsuario = req.user.id;
        const rolUsuario = req.user.rol;
        const idProyecto = req.params.id || req.body.id_proyecto;

        if (rolUsuario === 'admin') {
            return next();
        }
        if (rolUsuario === 'lider') {
            const [rows] = await db.execute(
                `SELECT 1 FROM lider_proyecto
                 WHERE id_proyecto = ? AND id_lider = ?`,
                [idProyecto, idUsuario]
            );

            if (rows.length === 0) {
                return next(new AppError('No estás asignado como líder en este proyecto.', 403));
            }
            
            return next(); 
        }

        return next(new AppError('No tienes permisos de edición en este proyecto.', 403));

    } catch (err) {
        next(err);
    }
};

module.exports = { verificarLiderDelProyecto };