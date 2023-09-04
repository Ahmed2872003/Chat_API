// router
const router = require("express").Router();

// middlewares
const { uploadImg } = require("../controllers/upload");

// multer
const multer = require("multer");

const isImage = require("../util/isImage");

const uploadImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    isImage(file, cb);
  },
});

// routes
router.post("/", uploadImage.single("image"), uploadImg);

module.exports = router;
