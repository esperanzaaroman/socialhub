const express = require('express');
<<<<<<< HEAD
const path = require("path");
const widgetRoutes = require('./routes/widgetRoutes');
=======
>>>>>>> f43d24c1622a0f1ec066197734cda28a1abb0fff
const cors = require('cors');
const conexion = require("./config/db");
require('dotenv').config();

const widgetRoutes = require('./routes/widgetRoutes');

const adminRoutes = require('./routes/adminRoutes');

const authRoutes = require('./routes/auth'); 


const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { sendSuccess } = require('./utils/apiResponse');

const app = express();

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
app.use(express.static(path.join(__dirname,"../public")));

app.use('/api/widgets',widgetRoutes);
app.get('/api/health',(req,res)=>{
    res.json({status:'Servidor corriendo'});
=======
app.get('/api/health', (req, res) => {
    sendSuccess(res, {
        message: 'Servidor corriendo', 
        data: { status: 'ok' }
    });
>>>>>>> f43d24c1622a0f1ec066197734cda28a1abb0fff
});


app.use('/api/auth', authRoutes);    
       

app.use('/api/widgets', widgetRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
<<<<<<< HEAD
app.listen(PORT,()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

app.get("/ods",async (req,res)=>{
    try{
        const sql = "SELECT id_ods, nombre FROM ods";
        const [resultados]=await conexion.query(sql);
        res.json(resultados);
    }catch(err){
        console.log(err);

        res.status(500).json(err);
    }
});
=======

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = app;
>>>>>>> f43d24c1622a0f1ec066197734cda28a1abb0fff
