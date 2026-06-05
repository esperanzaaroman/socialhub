const express = require('express');
const router = express.Router();

const {
  getAvailableProjects,
  createForumPost,
  getForumPosts,
  createForumComment,
  deleteForumPost,
  deleteForumComment
} = require('../controllers/forumController');

const {
  verifyToken,
  verifyAdmin
} = require('../middleware/authMiddleware');

const uploadForum =
  require('../middleware/forumUploadMiddleware');

router.get(
  '/projects',
  verifyToken,
  getAvailableProjects
);
router.post(
  '/posts',
  verifyToken,
  uploadForum.single('multimedia_publi'),
  createForumPost
);
router.get(
  '/posts',
  getForumPosts
);
router.post(
  '/posts/:id/comments',
  verifyToken,
  createForumComment
);

router.delete(
  '/posts/:id',
  verifyToken,
  verifyAdmin,
  deleteForumPost
);

router.delete(
  '/comments/:id',
  verifyToken,
  verifyAdmin,
  deleteForumComment
);

module.exports = router;
