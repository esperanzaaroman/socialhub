const pool =
  require('../config/db');

async function createTestimonio(
  id_proyecto,
  texto
) {

  const [result] =
    await pool.query(
      `
      INSERT INTO testimonio (
        id_proyecto,
        texto
      )
      VALUES (?, ?)
      `,
      [
        id_proyecto,
        texto
      ]
    );

  return result.insertId;

}

async function getTestimoniosByProject(
  id_proyecto
) {

  const [rows] =
    await pool.query(
      `
      SELECT
        id_testimonio,
        texto,
        fecha_hora
      FROM testimonio
      WHERE id_proyecto = ?
      ORDER BY fecha_hora DESC
      `,
      [id_proyecto]
    );

  return rows;

}

module.exports = {
  createTestimonio,
  getTestimoniosByProject
};