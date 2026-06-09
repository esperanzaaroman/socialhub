const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
console.log(proyectoController);
const { verifyToken } = require('../middleware/authMiddleware');
const { verificarLiderDelProyecto } = require('../middleware/proyectoAccess');
const { conectarUsuarioOpcional } = require('../middleware/authOpcional');
const { getBeneficiariosCount } = require('../controllers/proyectoController');
console.log(typeof verifyToken);
router.post('/',verifyToken,proyectoController.createProyecto);
router.get(
  '/:id/lideres',
  proyectoController.getLideresByProyecto
);
router.get('/:id',conectarUsuarioOpcional,proyectoController.getProyectoById);
router.get('/',proyectoController.obtenerTodosLosProyectos);
router.get('/:id/beneficiarios/count', getBeneficiariosCount);

module.exports = router;