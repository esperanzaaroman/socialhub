const {
  getProjectsForUser,
  createPost,
  getAllPosts,
  getCommentsByPost,
  createComment,
  deletePost,
  deleteComment,
  
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

        const comentarios =
        await getCommentsByPost();

        const postsConComentarios =
        posts.map(function(post) {

            return {
            ...post,
            comentarios:
                comentarios.filter(function(comentario) {
                return comentario.id_publi === post.id_publi;
                })
            };

        });

        res.json(postsConComentarios);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje:
        'Error obteniendo publicaciones'
    });

  }

}

async function createForumComment(req, res) {

  try {

    const { id } =
      req.params;

    const { texto } =
      req.body;

    if (!texto) {
      return res.status(400).json({
        mensaje: 'Escribe un comentario'
      });
    }

    const id_comentario =
      await createComment(
        req.usuario.id,
        id,
        texto
      );

    res.status(201).json({
      mensaje: 'Comentario creado correctamente',
      id_comentario
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error creando comentario'
    });

  }

}
async function deleteForumPost(req, res) {

  try {

    const { id } =
      req.params;

    await deletePost(id);

    res.json({
      mensaje: 'Publicación eliminada correctamente'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error eliminando publicación'
    });

  }

}

async function deleteForumComment(req, res) {

  try {

    const { id } =
      req.params;

    await deleteComment(id);

    res.json({
      mensaje: 'Comentario eliminado correctamente'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error eliminando comentario'
    });

  }

}

module.exports = {
  getAvailableProjects,
  createForumPost,
  getForumPosts,
  createForumComment,
  deleteForumComment,
  deleteForumPost
};


