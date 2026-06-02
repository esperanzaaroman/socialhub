const express = require('express');
const router = express.Router();


const {
  login,
  me,
  updateProfile,
  uploadProfilePhoto,
  getProfileById
} = require('../controllers/authController');


const {
  verifyToken
} = require('../middleware/authMiddleware');

const upload =
  require('../middleware/uploadMiddleware');


router.post('/login', login);
router.get(
  '/me',
  verifyToken,
  me
);

router.get(
  '/profile/:id',
  getProfileById
);

router.put(
  '/profile',
  verifyToken,
  updateProfile
);

router.put(
  '/profile-photo',
  verifyToken,
  upload.single('foto_perfil'),
  uploadProfilePhoto
);

module.exports = router;

