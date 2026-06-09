const sendSuccess = (res, { statusCode = 200, message = 'OK', data = null } = {}) => {
    const body = { success: true, message };
    if (data !== null) {
        body.data = data;
    }
    return res.status(statusCode).json(body);
};

const sendError = (res, { statusCode = 500, message = 'Error interno del servidor' } = {}) => {
    return res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = { sendSuccess, sendError };
