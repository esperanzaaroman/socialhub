const jwt = require('jsonwebtoken');

const conectarUsuarioOpcional = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        req.usuario = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta');
        req.usuario = decoded; 
        next();
    } catch (err) {
        req.usuario = null;
        next();
    }
};

module.exports = { conectarUsuarioOpcional };