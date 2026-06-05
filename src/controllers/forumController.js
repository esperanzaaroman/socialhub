const {
  getProjectsForUser,
  createPost,
  getAllPosts
} = require('../models/forumModel');

async function getAvailableProjects(req, res) {

  try {

    const proyectos =
      await getProjectsForUser(
        req.usuario.id,
        req.usuario.role
      );

    res.json(proyectos);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error obteniendo proyectos'
    });

  }

}

async function createForumPost(req, res) {

  try {

    const {
      texto,
      id_proyecto
    } = req.body;

    if (!texto || !id_proyecto) {
      return res.status(400).json({
        mensaje: 'Selecciona un proyecto y escribe una publicación'
      });
    }

    const id_publi =
      await createPost(
        req.usuario.id,
        texto,
        id_proyecto
      );

    res.status(201).json({
      mensaje: 'Publicación creada correctamente',
      id_publi
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error creando publicación'
    });

  }

}

async function getForumPosts(
  req,
  res
) {

  try {

    const posts =
      await getAllPosts();

    res.json(posts);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje:
        'Error obteniendo publicaciones'
    });

  }

}
module.exports = {
  getAvailableProjects,
  createForumPost,
  getForumPosts
};


