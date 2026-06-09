const express = require('express');
const router = express.Router();
const widgetController = require('../controllers/widgetController');
router.put('/layout',widgetController.guardarLayoutDashboard);
router.get('/', widgetController.getWidgets);
router.get('/metricas/:id_proyecto',widgetController.getMetricasByProyecto);
router.post('/:id/valores', widgetController.agregarValorWidget);
router.get('/:id', widgetController.getWidgetById);
router.post('/', widgetController.createWidgetDinamico);
router.put('/:id', widgetController.updateWidget);
router.delete('/:id', widgetController.deleteWidget);

module.exports = router;
