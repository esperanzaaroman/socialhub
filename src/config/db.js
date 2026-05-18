const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0
});

pool.getConnection()
    .then(connection=>{
        console.log('Conexion a MAriaDB establecida con exito');
        connection.release();
    })
    .catch(err=>{
        console.error('Error al conectarse a la base de datos',err.message);
    });
module.exports=pool;