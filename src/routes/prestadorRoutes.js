const express = require('express');
const router = express.Router();
const prestadorController = require('../controllers/prestadorController');
const { verifyToken } = require('../middleware/authMiddleware');

const { cargaMasivaPrestadores, crearPrestadorIndividual, getPrestadores, getPrestadoresPorProyecto } = require('../controllers/prestadorController');

router.post('/', verifyToken, crearPrestadorIndividual);
router.get('/', getPrestadores);
router.get('/:id',getPrestadoresPorProyecto);
router.post('/lote', verifyToken, cargaMasivaPrestadores);
module.exports = router;