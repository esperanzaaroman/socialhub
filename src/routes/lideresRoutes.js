const express = require('express');
const router  = express.Router();
const db      = require('../config/db');
const { sendSuccess } = require('../utils/apiResponse');


const asyncHandler    = require('../middleware/asyncHandler');

router.get('/', asyncHandler(async (req, res) => {

   const [rows] = await db.execute(
        `SELECT l.id_lider, l.carrera, l.estado, u.username, u.correo
         FROM lider l
         JOIN usuario u ON l.id_lider = u.id_usuario
         ORDER BY l.estado DESC`
    );
    sendSuccess(res, { data: rows });
}));

module.exports = router;