const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  findUserByEmail,
  isAdmin,
  isLeader,
  findUserById
} = require('../models/authModel');

async function login(req, res){
    const {correo, contrasena} = req.body;

    const usuario = await findUserByEmail(correo);
    if (!usuario) {
        return res.status(401).json({mensaje: 'Correo o contraseña no son correctos.'});
    }

    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordValida) {
        return res.status(401).json({mensaje: 'Correo o contraseña no son correctos.'});
    }

    let role = null;

    if (await isAdmin(usuario.id_usuario)) {
        role = 'admin';
    }
    else if (await isLeader(usuario.id_usuario)) {
        role = 'lider';
}

    const token = jwt.sign(
        {
            id: usuario.id_usuario,
            correo: usuario.correo,
            role
        },
        process.env.JWT_SECRET,
        { expiresIn: '8h'}
    );

    res.json({
        token,
        role
    });
}


async function me(req, res) {

  try {

    const usuarioDB =
      await findUserById(req.usuario.id);

    if (!usuarioDB) {

      return res.status(404).json({
        mensaje: 'Usuario no encontrado'
      });

    }

    res.json({
      id_usuario: usuarioDB.id_usuario,
      username: usuarioDB.username,
      correo: usuarioDB.correo,
      role: req.usuario.role
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error obteniendo usuario'
    });

  }

}

module.exports = { login, me }; 
