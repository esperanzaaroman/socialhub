const express = require('express');
const router = express.Router();
const beneficiarioController = require('../controllers/beneficiarioController');
const { verifyToken } = require('../middleware/authMiddleware');

const { cargaMasivaBeneficiarios, crearBeneficiarioIndividual,getBeneficiariosPorProyecto,getBeneficiarios } = require('../controllers/beneficiarioController');

router.post('/', verifyToken, crearBeneficiarioIndividual);
router.post('/lote', verifyToken, cargaMasivaBeneficiarios);
router.get('/',getBeneficiarios);
router.get('/:id',getBeneficiariosPorProyecto);
module.exports = router;