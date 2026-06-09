const express = require('express');
const path = require("path");
const cors = require('cors');
require('dotenv').config();



const conexion = require("./config/db");
console.log(process.env.DB_NAME);

const beneficiarioRoutes = require('./routes/beneficiariosRoutes');
const prestadorRoutes = require('./routes/prestadorRoutes');
const catalogoRoutes = require('./routes/catalogoRoutes');
const widgetRoutes = require('./routes/widgetRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/auth');
const metricaRoutes = require('./routes/metricaRoutes');
const proyectoRoutes = require('./routes/proyectoRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { sendSuccess } = require('./utils/apiResponse');
const forumRoutes =
  require('./routes/forum');
  
const testimonioRoutes =
  require('./routes/testimonio');

const app = express();


app.use(express.static('public'));
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname,"../public")));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/publico-inicio.html'));
});
app.use('/api/widgets',widgetRoutes);
app.use('/api/proyectos',proyectoRoutes);
app.get('/api/health', (req, res) => {
    sendSuccess(res, {
        message: 'Servidor corriendo', 
        data: { status: 'ok' }
    });
});

app.use('/api/auth', authRoutes);           
app.use(express.static(path.join(__dirname, "../public")));

app.use('/api',metricaRoutes);
app.use('/api/widgets', widgetRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/catalogos',catalogoRoutes);
app.use('/api/beneficiarios',beneficiarioRoutes);
app.use('/api/prestadores',prestadorRoutes);

app.use(
  '/api/forum',
  forumRoutes
);

app.use(
  '/api/testimonios',
  testimonioRoutes
);

app.get('/api/health', (req, res) => {
    sendSuccess(res, {
        message: 'Servidor corriendo',
        data: { status: 'ok' }
    });
});


app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;




app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = app;

