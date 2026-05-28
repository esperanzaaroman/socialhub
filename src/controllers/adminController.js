const bcrypt = require('bcrypt');

const {createUsuario, createLider, createAdmin} = require('../models/adminModel');

async function createLeader(req, res) {
  try {

    const {
      username,
      correo,
      contrasena,
    } = req.body;


    const contrasenaHash = await bcrypt.hash(contrasena, 10);
    const id_usuario = await createUsuario(
      username,
      correo,
      contrasenaHash
    );

    await createLider(id_usuario);

    res.status(201).json({mensaje: 'Líder creado correctamente',id_usuario});

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error al crear líder'
    });

  }
}

async function createAdminUser(req, res) {

  try {

    const {
      username,
      correo,
      contrasena
    } = req.body;

    const contrasenaHash = await bcrypt.hash(contrasena, 10);


    const id_usuario = await createUsuario(
      username,
      correo,
      contrasenaHash
    );

    await createAdmin(id_usuario);

    res.status(201).json({
      mensaje: 'Admin creado correctamente',
      id_usuario
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error al crear admin'
    });

  }
}

module.exports = {createLeader, createAdminUser};