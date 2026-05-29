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

module.exports = { findUserByEmail, isAdmin, isLeader};