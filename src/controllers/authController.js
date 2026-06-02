const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  findUserByEmail,
  isAdmin,
  isLeader,
  findUserById,
  updateUsuarioProfile,
  updateLiderProfile
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
    telefono: usuarioDB.telefono,
    linkedin: usuarioDB.linkedin,
    cvu: usuarioDB.cvu,
    carrera: usuarioDB.carrera,
    estado: usuarioDB.estado,
    foto_perfil: usuarioDB.foto_perfil,
    fecha_registro: usuarioDB.fecha_registro,
    role: req.usuario.role
  });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error obteniendo usuario'
    });

  }

}

async function updateProfile(req, res) {

  try {

    const {
      username,
      correo,
      telefono,
      linkedin,
      cvu,
      carrera
    } = req.body;

    if (!username || !correo) {
      return res.status(400).json({
        mensaje: 'Nombre y correo son obligatorios'
      });
    }

    await updateUsuarioProfile(
      req.usuario.id,
      username,
      correo,
      telefono || null,
      linkedin || null,
      cvu || null
    );

    if (
      req.usuario.role === 'lider' &&
      carrera !== undefined
    ) {

      await updateLiderProfile(
        req.usuario.id,
        carrera || null
      );

    }

    res.json({
      mensaje: 'Perfil actualizado correctamente'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error actualizando perfil'
    });

  }

}
module.exports = {
  login,
  me,
  updateProfile
};
