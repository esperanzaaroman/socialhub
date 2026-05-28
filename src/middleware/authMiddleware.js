const jwt = require('jsonwebtoken');
const { isAdmin } = require('../models/adminModel');

function verifyToken(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      mensaje: 'Token no proporcionado'
    });
  }
  const token = authHeader.split(' ')[1];

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.usuario = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      mensaje: 'Token inválido'
    });

  }
}

async function verifyAdmin(req, res, next) {

  try {

    // user id came from JWT middleware
    const id_usuario = req.usuario.id;

    // check DB
    const admin = await isAdmin(id_usuario);

    if (!admin) {
      return res.status(403).json({
        mensaje: 'Acceso denegado'
      });
    }

    next();

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      mensaje: 'Error verificando admin'
    });

  }
}

module.exports = {
  verifyToken,
  verifyAdmin
};