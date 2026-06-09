const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
console.log(proyectoController);
const { verifyToken } = require('../middleware/authMiddleware');
const { verificarLiderDelProyecto } = require('../middleware/proyectoAccess');
const { conectarUsuarioOpcional } = require('../middleware/authOpcional');
const { getBeneficiariosCount } = require('../controllers/proyectoController');
const uploadProjectImage =
  require('../middleware/projectImageUploadMiddleware');
console.log(typeof verifyToken);
router.post('/',verifyToken,proyectoController.createProyecto);
router.get(
  '/:id/imagen',
  proyectoController.getProyectoImagen
);

router.put(
  '/:id/imagen',
  verifyToken,
  uploadProjectImage.single('imagen_proyecto'),
  proyectoController.updateProyectoImagen
);
router.get(
  '/:id/lideres',
  proyectoController.getLideresByProyecto
);
router.get('/:id',conectarUsuarioOpcional,proyectoController.getProyectoById);
router.get('/',proyectoController.obtenerTodosLosProyectos);
router.get('/:id/beneficiarios/count', getBeneficiariosCount);

module.exports = router;