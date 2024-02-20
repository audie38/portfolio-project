const router = require("express").Router();
const protect = require("../middleware/authHandler");
const { registerUser, getLoggedInUser, editUser, deleteUser, userLogin, userLogout } = require("../controllers/userController");

router.route("/").get(protect, getLoggedInUser).post(registerUser).put(protect, editUser).delete(protect, deleteUser);
router.route("/login").post(userLogin);
router.route("/logout").post(userLogout);

module.exports = router;
