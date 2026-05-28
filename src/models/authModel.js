const pool = require('../config/db');

async function findUserByEmail(correo) {
  const [rows] = await pool.query(
    'SELECT * FROM usuario WHERE correo = ?',
    [correo]
  );

  return rows[0];
}

module.exports = { findUserByEmail};