const express = require('express');
const router = express.Router();
const widgetController = require('../controllers/widgetController');

router.post('/',widgetController.createWidget);


module.exports = router;


