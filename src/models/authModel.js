const pool = require('../config/db');

async function findUserByEmail(correo) {
  const [rows] = await pool.query(
    'SELECT * FROM usuario WHERE correo = ?',
    [correo]
  );

  return rows[0];
}

async function createUser(username, correo, contrasenaHash) {
  const [result] = await pool.query(
    'INSERT INTO usuario (username, correo, contrasena) VALUES (?, ?, ?)',
    [username, correo, contrasenaHash]
  );

  return result.insertId;
}

module.exports = { findUserByEmail, createUser };