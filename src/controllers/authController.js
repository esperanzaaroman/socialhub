const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  findUserByEmail,
  isAdmin,
  isLeader,
  findUserById,
  updateUsuarioProfile,
  updateLiderProfile,
  updateProfilePhoto,
  findAllLeaders
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
      carrera
    } = req.body;

    if (!username || !correo) {
      return res.status(400).json({
        mensaje: 'Nombre y correo son obligatorios'
      });
    }

    if (
      username.length < 3 ||
      username.length > 50
    ) {
      return res.status(400).json({
        mensaje: 'El nombre debe tener entre 3 y 50 caracteres'
      });
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(correo)) {
      return res.status(400).json({
        mensaje: 'Correo inválido'
      });
    }

    if (
      telefono &&
      !/^[0-9]{10}$/.test(telefono)
    ) {
      return res.status(400).json({
        mensaje: 'Teléfono inválido'
      });
    }

    if (
      linkedin &&
      linkedin.length > 150
    ) {
      return res.status(400).json({
        mensaje: 'LinkedIn demasiado largo'
      });
    }


    await updateUsuarioProfile(
      req.usuario.id,
      username,
      correo,
      telefono || null,
      linkedin || null,
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

    if (
      error.code === 'ER_DUP_ENTRY' ||
      error.errno === 1062
    ) {
      return res.status(409).json({
        mensaje: 'Ese correo ya está registrado'
      });
    }

    res.status(500).json({
      mensaje: 'Error actualizando perfil'
    });

  }

}

async function uploadProfilePhoto(req, res) {

  try {

    if (!req.file) {
      return res.status(400).json({
        mensaje: 'No se subió ninguna imagen'
      });
    }

    const foto_perfil =
      `uploads/perfiles/${req.file.filename}`;

    await updateProfilePhoto(
      req.usuario.id,
      foto_perfil
    );

    res.json({
      mensaje: 'Foto de perfil actualizada correctamente',
      foto_perfil
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error subiendo foto de perfil'
    });

  }

}

async function getProfileById(req, res) {

  try {

    const { id } =
      req.params;

    const perfil =
      await findUserById(id);

    if (!perfil) {
      return res.status(404).json({
        mensaje: 'Perfil no encontrado'
      });
    }

    res.json({
      id_usuario: perfil.id_usuario,
      username: perfil.username,
      correo: perfil.correo,
      telefono: perfil.telefono,
      linkedin: perfil.linkedin,
      carrera: perfil.carrera,
      estado: perfil.estado,
      foto_perfil: perfil.foto_perfil,
      fecha_registro: perfil.fecha_registro
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error obteniendo perfil'
    });

  }

}

async function getLeaders(req, res) {

  try {

    const lideres =
      await findAllLeaders();

    res.json(lideres);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error obteniendo líderes'
    });

  }

}

module.exports = {
  login,
  me,
  updateProfile,
  uploadProfilePhoto,
  getProfileById,
  getLeaders
};
