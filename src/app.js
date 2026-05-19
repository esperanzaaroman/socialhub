const express = require('express');
const widgetRoutes = require('./routes/widgetRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/widgets',widgetRoutes);
app.get('/api/health',(req,res)=>{
    res.json({status:'Servidor corriendo'});
});

const authRoutes = require('./routes/auth'); 
app.use('/api/auth', authRoutes);           


const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log('Servidor escuchando en el puerto ${PORT');
});