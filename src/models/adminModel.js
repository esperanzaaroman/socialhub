const pool = require('../config/db');

async function createUsuario(username, correo, contrasenaHash) {
  const [result] = await pool.query(
    `
    INSERT INTO usuario 
    (username, correo, contrasena)
    VALUES (?, ?, ?)
    `,
    [username, correo, contrasenaHash]
  );

  return result.insertId;
}

async function createLider(id_usuario) {
  await pool.query(
    `
    INSERT INTO lider
    (id_lider)
    VALUES (?)
    `,
    [id_usuario]
  );
}

async function createAdmin(id_usuario) {
  await pool.query(
    `
    INSERT INTO admin
    (id_admin)
    VALUES (?)
    `,
    [id_usuario]
  );
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

module.exports = {
  createUsuario,
  createLider,
  createAdmin,
  isAdmin
};