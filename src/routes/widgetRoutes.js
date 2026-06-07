const express = require('express');
const router = express.Router();
const widgetController = require('../controllers/widgetController');
router.put('/layout',widgetController.guardarLayoutDashboard);
router.get('/', widgetController.getWidgets);
router.get('/:id', widgetController.getWidgetById);
router.post('/', widgetController.createWidgetDinamico);
router.patch('/:id', widgetController.updateWidget);
router.delete('/:id', widgetController.deleteWidget);

module.exports = router;
