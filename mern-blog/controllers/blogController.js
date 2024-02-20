const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");

const Blog = require("../models/Blog");

// @desc    Get List of All Blogs
// @route   GET /api/v1/blog
// @access  Public
const getAllBlog = asyncHandler(async (req, res) => {
  const query = req.query;
  const params = Object.values(query);
  const queryParameter = params[0];
  let responses = await Blog.findAll();

  if (params.length > 0) {
    responses = await Blog.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${queryParameter}%`,
            },
          },
          {
            summary: {
              [Op.like]: `%${queryParameter}%`,
            },
          },
          {
            content: {
              [Op.like]: `%${queryParameter}%`,
            },
          },
        ],
      },
    });
  }

  return res.status(200).json({
    code: 200,
    status: "ok",
    data: responses,
  });
});

// @desc    Get List of User's Blogs
// @route   GET /api/v1/dashboard
// @access  Private
const getDashboardData = asyncHandler(async (req, res) => {
  const query = req.query;
  const params = Object.values(query);
  const queryParameter = params[0];

  if (!req.user) {
    return res.status(204).json({ message: "No Data Found..." });
  }

  let responses = await Blog.findAll({
    where: {
      userId: req?.user?.userId,
    },
  });

  if (params.length > 0) {
    responses = await Blog.findAll({
      where: {
        [Op.and]: [
          { userId: req?.user?.userId },
          {
            [Op.or]: [
              {
                title: {
                  [Op.like]: `%${queryParameter}%`,
                },
              },
              {
                summary: {
                  [Op.like]: `%${queryParameter}%`,
                },
              },
              {
                content: {
                  [Op.like]: `%${queryParameter}%`,
                },
              },
            ],
          },
        ],
      },
    });
  }

  return res.status(200).json({
    code: 200,
    status: "ok",
    data: responses,
  });
});

// @desc    Get Blog by blogId
// @route   GET /api/v1/blog/:id
// @access  Public
const getBlogById = asyncHandler(async (req, res) => {
  const blogId = req.params.id;
  if (!blogId) {
    return res.status(400).json({ message: "Invalid Blog Id" });
  }

  const response = await Blog.findByPk(blogId);
  if (!response) {
    return res.status(404).json({ message: "Blog Not Found" });
  }

  return res.status(200).json({
    code: 200,
    status: "ok",
    data: response,
  });
});

// @desc    Create New Blog
// @route   POST /api/v1/blog
// @access  Private
const createNewBlog = asyncHandler(async (req, res) => {
  const { title, summary, content, cover } = req.body;
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Invalid Author" });
  }

  if (!title) {
    return res.status(400).json({ message: "Blog Title Cannot be empty" });
  }

  const newBlog = await Blog.create({
    title: title,
    summary: summary,
    content: content,
    cover: cover,
    userId: userId,
  });

  if (newBlog) {
    return res.status(201).json({
      code: 200,
      status: "ok",
      data: {
        blogId: newBlog.blogId,
        title: newBlog.title,
        summary: newBlog.summary,
        content: newBlog.content,
        cover: newBlog.cover,
        userId: newBlog.userId,
      },
    });
  }

  return res.status(500).json({
    message: "Internal Server Error",
  });
});

// @desc    Update Blog
// @route   PUT /api/v1/blog/:id
// @access  Private
const updateBlog = asyncHandler(async (req, res) => {
  const blogId = req.params.id;
  if (!blogId) {
    return res.status(400).json({ message: "Invalid Blog Id" });
  }

  const existingBlog = await Blog.findByPk(blogId);
  if (!existingBlog) {
    return res.status(404).json({ message: "Blog Not Found" });
  }

  if (parseInt(existingBlog.userId) == parseInt(req.user?.userId)) {
    const { title, summary, content, cover } = req.body;
    existingBlog.title = title || existingBlog.title;
    existingBlog.summary = summary || existingBlog.summary;
    existingBlog.content = content || existingBlog.content;

    if (cover != undefined || cover != null) {
      if (existingBlog.cover !== null && existingBlog.cover !== "") {
        const rawLocation = existingBlog?.cover.replace(`${req.get("host")}/api/v1/asset/img/`, "");
        const deletedImgPath = path.join(__dirname, "..", "public/uploads/", rawLocation);

        if (fs.existsSync(deletedImgPath)) {
          await fs.promises.unlink(deletedImgPath, (err) => {
            if (err) {
              return res.status(500).json({ message: err });
            }
          });
        }
      }
      existingBlog.cover = cover;
    }

    const updatedBlog = await existingBlog.save();
    if (updatedBlog) {
      return res.status(200).json({
        code: 200,
        status: "ok",
        data: {
          blogId: updatedBlog.blogId,
          title: updatedBlog.title,
          summary: updatedBlog.summary,
          content: updatedBlog.content,
          cover: updatedBlog.cover,
          userId: updatedBlog.userId,
        },
      });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }

  return res.status(401).json({ message: "UnAuthorized" });
});

// @desc    Delete Blog
// @route   DELETE /api/v1/blog/:id
// @access  Private
const deleteBlog = asyncHandler(async (req, res) => {
  const blogId = req.params.id;
  if (!blogId) {
    return res.status(400).json({ message: "Invalid Blog Id" });
  }

  const existingBlog = await Blog.findByPk(blogId);
  if (!existingBlog) {
    return res.status(404).json({ message: "Blog Not Found" });
  }

  if (parseInt(existingBlog.userId) == parseInt(req.user?.userId)) {
    let isImageDeleted = true;
    if (existingBlog.cover !== null && existingBlog.cover !== "") {
      const rawLocation = existingBlog?.cover.replace(`${req.get("host")}/api/v1/asset/img/`, "");
      const deletedImgPath = path.join(__dirname, "..", "public/uploads/", rawLocation);

      if (fs.existsSync(deletedImgPath)) {
        await fs.promises.unlink(deletedImgPath, (err) => {
          if (err) {
            isImageDeleted = false;
            return res.status(500).json({ message: err });
          }
        });
      }
    }

    if (isImageDeleted) {
      const blogDeleted = await existingBlog.destroy();
      if (blogDeleted) {
        return res.status(200).json({
          code: 200,
          status: "ok",
        });
      }

      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  return res.status(401).json({ message: "UnAuthorized" });
});

module.exports = {
  getAllBlog,
  getDashboardData,
  getBlogById,
  createNewBlog,
  updateBlog,
  deleteBlog,
};
