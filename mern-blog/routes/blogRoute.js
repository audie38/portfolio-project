const router = require("express").Router();
const protect = require("../middleware/authHandler");
const { getAllBlog, getBlogById, createNewBlog, updateBlog, deleteBlog } = require("../controllers/blogController");

router.route("/").get(getAllBlog).post(protect, createNewBlog);
router.route("/:id").get(getBlogById).put(protect, updateBlog).delete(protect, deleteBlog);

module.exports = router;
