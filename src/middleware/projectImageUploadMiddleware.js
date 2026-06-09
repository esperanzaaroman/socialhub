const multer =
  require('multer');

const path =
  require('path');

const storage =
  multer.diskStorage({
    destination: function(req, file, cb) {
      cb(
        null,
        'public/uploads/proyectos'
      );
    },

    filename: function(req, file, cb) {
      const extension =
        path.extname(file.originalname);

      cb(
        null,
        `proyecto-${req.params.id}-${Date.now()}${extension}`
      );
    }
  });

const uploadProjectImage =
  multer({
    storage
  });

module.exports =
  uploadProjectImage;