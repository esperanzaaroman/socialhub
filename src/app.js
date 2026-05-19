const express = require('express');
const cors = require('cors');
require('dotenv').config();

const widgetRoutes = require('./routes/widgetRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { sendSuccess } = require('./utils/apiResponse');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    sendSuccess(res, {
        message: 'Servidor corriendo',
        data: { status: 'ok' }
    });
});

const authRoutes = require('./routes/auth'); 
app.use('/api/auth', authRoutes);           

app.use('/api/widgets', widgetRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = app;
