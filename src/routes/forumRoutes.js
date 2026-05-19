/**
 * Foro — endpoints propuestos (sin implementar aún):
 *
 * GET    /api/forum/posts              — listar publicaciones (?id_proyecto=)
 * GET    /api/forum/posts/:id          — detalle + comentarios
 * POST   /api/forum/posts              — crear publicación
 * PATCH  /api/forum/posts/:id          — editar publicación
 * DELETE /api/forum/posts/:id          — eliminar publicación
 *
 * POST   /api/forum/posts/:id/comments — crear comentario
 * DELETE /api/forum/comments/:id       — eliminar comentario
 *
 * POST   /api/forum/posts/:id/likes    — dar like
 * DELETE /api/forum/posts/:id/likes    — quitar like
 */
const express = require('express');
const router = express.Router();

module.exports = router;
