const express =
  require('express');

const router =
  express.Router();

const {
  createProjectTestimonio,
  getProjectTestimonios
} = require(
  '../controllers/testimonioController'
);

const {
  verifyToken
} = require(
  '../middleware/authMiddleware'
);

router.get(
  '/proyecto/:idProyecto',
  getProjectTestimonios
);

router.post(
  '/',
  verifyToken,
  createProjectTestimonio
);

module.exports =
  router;