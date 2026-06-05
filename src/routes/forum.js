const express = require('express');
const router = express.Router();

const {
  getAvailableProjects,
  createForumPost
} = require('../controllers/forumController');

const {
  verifyToken
} = require('../middleware/authMiddleware');

router.get(
  '/projects',
  verifyToken,
  getAvailableProjects
);
router.post(
  '/posts',
  verifyToken,
  createForumPost
);


module.exports = router;
