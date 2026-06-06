const CatalogoModel = require('../models/catalogoModel');
const asyncHandler = require('../middleware/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const getFormCatalogos = asyncHandler(async (req, res) => {
    const categorias = await CatalogoModel.getCategorias();
    const ods = await CatalogoModel.getOds();
    const lideres = await CatalogoModel.getLideresActivos();

    sendSuccess(res, {
        message: 'Catálogos para formularios obtenidos con éxito',
        data: { categorias, ods, lideres }
    });
});

module.exports = { getFormCatalogos };