const router = require("express").Router();
const protect = require("../middleware/authHandler");
const { getDashboardData } = require("../controllers/blogController");

router.route("/").get(protect, getDashboardData);

module.exports = router;
