const express = require('express');
const router = express.Router();
const prestadorController = require('../controllers/prestadorController');
const { verifyToken } = require('../middleware/authMiddleware');

const { cargaMasivaPrestadores, crearPrestadorIndividual } = require('../controllers/prestadorController');

router.post('/', verifyToken, crearPrestadorIndividual);

router.post('/lote', verifyToken, cargaMasivaPrestadores);
module.exports = router;