const pool = require('../config/db');

async function findUserByEmail(correo) {
  const [rows] = await pool.query(
    'SELECT * FROM usuario WHERE correo = ?',
    [correo]
  );

  return rows[0];
}

async function isAdmin(id_usuario) {

  const [rows] = await pool.query(
    `
    SELECT * FROM admin
    WHERE id_admin = ?
    `,
    [id_usuario]
  );
  return rows.length > 0;
}
async function isLeader(id_usuario) {

  const [rows] = await pool.query(
    `
    SELECT * FROM lider
    WHERE id_lider = ?
    `,
    [id_usuario]
  );

  return rows.length > 0;
} 

async function findUserById(id_usuario) {

  const [rows] = await pool.query(
    `
    SELECT
      u.id_usuario,
      u.username,
      u.correo,
      u.fecha_registro,
      u.foto_perfil,
      u.telefono,
      u.linkedin,
      l.carrera,
      l.estado
    FROM usuario u
    LEFT JOIN lider l
      ON l.id_lider = u.id_usuario
    WHERE u.id_usuario = ?
    `,
    [id_usuario]
  );

  return rows[0];

}


async function updateUsuarioProfile(
  id_usuario,
  username,
  correo,
  telefono,
  linkedin,
) {

  const [result] = await pool.query(
    `
    UPDATE usuario
    SET username = ?,
        correo = ?,
        telefono = ?,
        linkedin = ?
    WHERE id_usuario = ?
    `,
    [
      username,
      correo,
      telefono,
      linkedin,
      id_usuario
    ]
  );

  return result;
}

async function updateLiderProfile(
  id_usuario,
  carrera
) {

  const [result] = await pool.query(
    `
    UPDATE lider
    SET carrera = ?
    WHERE id_lider = ?
    `,
    [
      carrera,
      id_usuario
    ]
  );

  return result;
}

async function updateProfilePhoto(
  id_usuario,
  foto_perfil
) {

  const [result] =
    await pool.query(
      `
      UPDATE usuario
      SET foto_perfil = ?
      WHERE id_usuario = ?
      `,
      [
        foto_perfil,
        id_usuario
      ]
    );

  return result;

}

async function findAllLeaders() {

  const [rows] = await pool.query(
    `
    SELECT
      u.id_usuario,
      u.username,
      u.correo,
      u.foto_perfil,
      l.carrera,
      l.estado,
      GROUP_CONCAT(p.nombre SEPARATOR ', ') AS proyectos
    FROM usuario u
    INNER JOIN lider l
      ON l.id_lider = u.id_usuario
    LEFT JOIN lider_proyecto lp
      ON lp.id_lider = l.id_lider
      AND lp.estado = 'activo'
    LEFT JOIN proyecto p
      ON p.id_proyecto = lp.id_proyecto
    WHERE l.estado = 'activo'
    GROUP BY
      u.id_usuario,
      u.username,
      u.correo,
      u.foto_perfil,
      l.carrera,
      l.estado
    ORDER BY u.username ASC
    `
  );

  return rows;
}

module.exports = {
  findUserByEmail,
  isAdmin,
  isLeader,
  findUserById,
  updateUsuarioProfile,
  updateLiderProfile,
  updateProfilePhoto,
  findAllLeaders
};