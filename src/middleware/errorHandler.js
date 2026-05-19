const sendError = require('../utils/apiResponse').sendError;

const notFoundHandler = (req, res) => {
    sendError(res, {
        statusCode: 404,
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    });
};

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.isOperational
        ? err.message
        : 'Error interno del servidor';

    if (!err.isOperational) {
        console.error('[error]', err);
    }

    const body = {
        success: false,
        message
    };

    if (process.env.NODE_ENV === 'development' && !err.isOperational) {
        body.detail = err.message;
    }

    res.status(statusCode).json(body);
};

module.exports = { notFoundHandler, errorHandler };
