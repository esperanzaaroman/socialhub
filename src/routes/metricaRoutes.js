const express = require('express');
const router = express.Router();
const metricaController = require('../controllers/metricaController'); 
const { verifyToken } = require('../middleware/authMiddleware'); 

router.get('/metricas/generales', metricaController.getMetricasGenerales);

router.get('/proyectos/:id/metricas-utilizadas', verifyToken, metricaController.getMetricasPorProyecto);
router.get('/metricas/:id/historial', metricaController.getHistorialMetrica);

module.exports = router;