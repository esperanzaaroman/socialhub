const express =
  require('express');

const router =
  express.Router();

const {
  createProjectTestimonio,
  getProjectTestimonios,
  getTestimonios
} = require(
  '../controllers/testimonioController'
);

const {
  verifyToken
} = require(
  '../middleware/authMiddleware'
);

router.get('/', getTestimonios);

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