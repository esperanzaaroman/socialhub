const multer =
  require('multer');

const path =
  require('path');

const storage =
  multer.diskStorage({
    destination: function(req, file, cb) {
      cb(
        null,
        'public/uploads/foro'
      );
    },

    filename: function(req, file, cb) {
      const extension =
        path.extname(file.originalname);

      cb(
        null,
        `foro-${Date.now()}${extension}`
      );
    }
  });

const uploadForum =
  multer({
    storage
  });

module.exports =
  uploadForum;