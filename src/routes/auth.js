const express = require('express');
const router = express.Router();


const {
  login,
  me,
  updateProfile,
  uploadProfilePhoto,
  getProfileById,
  getLeaders,
  createUserByAdmin,
  changePassword
} = require('../controllers/authController');


const {
  verifyToken,
  verifyAdmin
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

router.get(
  '/leaders',
  getLeaders
);

router.put(
  '/profile-photo',
  verifyToken,
  upload.single('foto_perfil'),
  uploadProfilePhoto
);

router.post(
  '/admin/create-user',
  verifyToken,
  verifyAdmin,
  createUserByAdmin
);
router.put(
  '/change-password',
  verifyToken,
  changePassword
);
module.exports = router;

