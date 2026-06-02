const express = require('express');
const path = require("path");
const cors = require('cors');
require('dotenv').config();



const conexion = require("./config/db");
console.log(process.env.DB_NAME);

const widgetRoutes = require('./routes/widgetRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/auth');

const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { sendSuccess } = require('./utils/apiResponse');

const app = express();


app.use(express.static('public'));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use('/api/widgets', widgetRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);


app.get('/api/health', (req, res) => {
    sendSuccess(res, {
        message: 'Servidor corriendo',
        data: { status: 'ok' }
    });
});

app.get("/ods", async (req, res) => {
    try {
        const sql = "SELECT id_ods, nombre FROM ods";
        const [resultados] = await conexion.query(sql);

        res.json(resultados);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = app;