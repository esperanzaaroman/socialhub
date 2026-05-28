const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../models/authModel');

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

async function register(req, res) {
  const { username, correo, contrasena } = req.body;

  // 1. ¿Ya existe ese correo?
  const existe = await findUserByEmail(correo);
  if (existe) {
    return res.status(400).json({ mensaje: 'Ese correo ya está registrado' });
  }

  // 2. Hashear la contraseña
  const hash = await bcrypt.hash(contrasena, 10);

  // 3. Crear el usuario
  const id = await createUser(username, correo, hash);

  res.status(201).json({ mensaje: 'Usuario creado', id });
}

module.exports = { login, register }; // ← actualiza el export
