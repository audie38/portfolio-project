const router = require("express").Router();
const uploadImage = require("../controllers/assetController");
const protect = require("../middleware/authHandler");

router.route("/").post(protect, uploadImage);

module.exports = router;
