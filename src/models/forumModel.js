const pool = require('../config/db');

async function getProjectsForUser(id_usuario, role) {
  let query;
  let params = [];

  if (role === 'admin') {
    query = `
      SELECT id_proyecto, nombre
      FROM proyecto
      ORDER BY nombre
    `;
  } else {
    query = `
      SELECT p.id_proyecto, p.nombre
      FROM proyecto p
      INNER JOIN lider_proyecto lp ON lp.id_proyecto = p.id_proyecto
      WHERE lp.id_lider = ? AND lp.estado = 'activo'
      ORDER BY p.nombre
    `;
    params = [id_usuario];
  }

  const [rows] = await pool.query(query, params);
  return rows;
}

async function createPost(id_usuario, texto, id_proyecto, multimedia_publi) {
  // CORREGIDO: Se agregó el cuarto "?" en el VALUES para "multimedia_publi"
  // Si multimedia_publi viene como undefined, le ponemos null por defecto
  const [result] = await pool.query(
    `
    INSERT INTO publicacion_foro (
      id_usuario,
      texto,
      id_proyecto,
      multimedia_publi
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      id_usuario,
      texto,
      id_proyecto,
      multimedia_publi || null
    ]
  );

  return result.insertId;
}

async function getAllPosts(filters = {}) {

  let where = '';
  let params = [];

  if (filters.projectId) {
    where = 'WHERE pf.id_proyecto = ?';
    params = [filters.projectId];
  }
  else if (filters.userId) {
    where = 'WHERE pf.id_usuario = ?';
    params = [filters.userId];
  }

  const [rows] = await pool.query(
    `
    SELECT
      pf.id_publi,
      pf.texto,
      pf.fecha_publicacion,
      pf.id_proyecto,
      pf.multimedia_publi,
      u.id_usuario,
      u.username,
      u.foto_perfil,
      p.nombre AS nombre_proyecto
    FROM publicacion_foro pf
    INNER JOIN usuario u
      ON u.id_usuario = pf.id_usuario
    INNER JOIN proyecto p
      ON p.id_proyecto = pf.id_proyecto
    ${where}
    ORDER BY pf.fecha_publicacion DESC
    `,
    params
  );

  return rows;
}

async function getCommentsByPost() {
  const [rows] = await pool.query(
    `
    SELECT
      c.id_comentario,
      c.id_publi,
      c.texto,
      c.fecha_publicacion,
      u.id_usuario,
      u.username,
      u.foto_perfil
    FROM comentario_foro c
    INNER JOIN usuario u ON u.id_usuario = c.id_usuario
    ORDER BY c.fecha_publicacion ASC
    `
  );
  return rows;
}

async function createComment(id_usuario, id_publi, texto) {
  const [result] = await pool.query(
    `
    INSERT INTO comentario_foro (
      id_usuario,
      id_publi,
      texto
    )
    VALUES (?, ?, ?)
    `,
    [id_usuario, id_publi, texto]
  );
  return result.insertId;
}

async function deletePost(id_publi) {
  await pool.query(
    `
    DELETE FROM comentario_foro
    WHERE id_publi = ?
    `,
    [id_publi]
  );

  const [result] = await pool.query(
    `
    DELETE FROM publicacion_foro
    WHERE id_publi = ?
    `,
    [id_publi]
  );
  return result;
}

async function deleteComment(id_comentario) {
  const [result] = await pool.query(
    `
    DELETE FROM comentario_foro
    WHERE id_comentario = ?
    `,
    [id_comentario]
  );
  return result;
}

module.exports = {
  getProjectsForUser,
  createPost,
  getAllPosts,
  getCommentsByPost,
  createComment,
  deletePost,
  deleteComment
};