//SOMEONE CALL A DOCTOOOORRRRR GOTTA CASE OF LOVE BIPOLARRRRRRRRRR
const pool = require('../config/db');

async function getAllPosts() {

  const [rows] = await pool.query(
    `
    SELECT
      p.id_publi,
      p.texto,
      p.fecha_publicacion,
      p.id_proyecto,
      p.multimedia_publi,
      u.id_usuario,
      u.username,
      u.foto_perfil
    FROM publicacion_foro p
    INNER JOIN usuario u
      ON u.id_usuario = p.id_usuario
    ORDER BY p.fecha_publicacion DESC
    `
  );

  return rows;
}

async function createPost(
  id_usuario,
  texto,
  id_proyecto = null
) {

  const [result] = await pool.query(
    `
    INSERT INTO publicacion_foro (
      id_usuario,
      texto,
      id_proyecto
    )
    VALUES (?, ?, ?)
    `,
    [
      id_usuario,
      texto,
      id_proyecto
    ]
  );

  return result.insertId;
}

module.exports = {
  getAllPosts,
  createPost
};

module.exports = {};
