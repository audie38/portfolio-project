const multer = require("multer");
const path = require("path");
const util = require("util");
const fileSizeConfig = process.env.FILE_UPLOAD_MAX_SIZE || 5;
const maxSize = parseInt(fileSizeConfig) * 1024 * 1024;
const fs = require("fs");
const fsPromises = require("fs").promises;

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(path.join(__dirname, "..", "public", "uploads"))) {
      fs.mkdirSync(path.join(__dirname, "..", "public", "uploads"), { recursive: true });
    }
    cb(null, path.join(__dirname, "..", "public", "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const uploadFile = multer({
  storage: diskStorage,
  limits: { fileSize: maxSize },
  onError: function (err, next) {
    next(err);
  },
}).single("file");

const uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFileMiddleware;
