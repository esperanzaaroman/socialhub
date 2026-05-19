const pool = require('../config/db');

async function findUserbyEmail(correo){
    const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE correo = ?',
        [correo]
    );
    return rows[0];
}
module.exports = { findUsersbyEmail };

async function createUser(username, correo, contrasenaHash) {
  const [result] = await pool.query(
    'INSERT INTO usuario (username, correo, contrasena) VALUES (?, ?, ?)',
    [username, correo, contrasenaHash]
  );
  return result.insertId;
}
