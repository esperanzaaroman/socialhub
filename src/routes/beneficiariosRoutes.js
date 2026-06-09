const express = require('express');
const router = express.Router();
const beneficiarioController = require('../controllers/beneficiarioController');
const { verifyToken } = require('../middleware/authMiddleware');

const { cargaMasivaBeneficiarios, crearBeneficiarioIndividual } = require('../controllers/beneficiarioController');

router.post('/', verifyToken, crearBeneficiarioIndividual);
router.post('/lote', verifyToken, cargaMasivaBeneficiarios);
module.exports = router;