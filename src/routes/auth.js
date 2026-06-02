const express = require('express');
const router = express.Router();


const {
  login,
  me,
  updateProfile
} = require('../controllers/authController');


const {
  verifyToken
} = require('../middleware/authMiddleware');



router.post('/login', login);
router.get(
  '/me',
  verifyToken,
  me
);

router.put(
  '/profile',
  verifyToken,
  updateProfile
);

module.exports = router;

