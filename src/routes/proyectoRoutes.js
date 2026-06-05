const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
console.log(proyectoController);
const { verifyToken } = require('../middleware/authMiddleware');
console.log(typeof verifyToken);
router.post('/',verifyToken,proyectoController.createProyecto);
router.get('/:id',proyectoController.getProyectoById);

module.exports = router;