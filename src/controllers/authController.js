const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  findUserByEmail,
  isAdmin,
  isLeader
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

function me(req, res) {

  res.json({
    usuario: req.usuario
  });

}

module.exports = { login, me }; 
