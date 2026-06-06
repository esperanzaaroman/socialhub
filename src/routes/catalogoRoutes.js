const express = require('express');
const router = express.Router();
const catalogoController = require('../controllers/catalogoController');

router.get('/datos-formulario', catalogoController.getFormCatalogos);

module.exports = router;