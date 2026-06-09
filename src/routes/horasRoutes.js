const express = require('express');
const router = express.Router();
const horasController = require('../controllers/horasController');
const { verifyToken } = require('../middleware/authMiddleware');
const {getHoras, getHorasPorProyecto} = require('../controllers/horasController')

router.get('/',getHoras);
router.get('/:id',getHorasPorProyecto);

module.exports =router;