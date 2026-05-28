const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByEmail} = require('../models/authModel');

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

    const token = jwt.sign(
        { id: usuario.id_usuario, correo: usuario.correo},
        process.env.JWT_SECRET,
        { expiresIn: '8h'}
    );

    res.json({ token });
}

module.exports = { login }; 
