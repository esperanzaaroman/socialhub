const express = require('express');

const router = express.Router();

const {
  createLeader,
  createAdminUser
} = require('../controllers/adminController');

const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.post(
  '/create-leader',
  verifyToken,
  verifyAdmin,
  createLeader
);

router.post(
  '/create-admin',
  verifyToken,
  verifyAdmin,
  createAdminUser
);

module.exports = router;