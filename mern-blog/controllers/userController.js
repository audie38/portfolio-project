const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");

const User = require("../models/User");
const { encryptPassword, validatePassword } = require("../utils/helper");
const generateToken = require("../utils/generateToken");

// @desc    Register New User
// @route   POST /api/v1/user
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { displayName, username, email, password, photo } = req.body;
  if (!displayName || !username || !email || !password) {
    return res.status(400).json({ message: "Incomplete Data" });
  }

  const userExists = await User.findOne({
    where: {
      [Op.or]: [{ email: email }, { username: username }],
    },
  });

  if (userExists) {
    return res.status(400).json({ message: "User Already Exists" });
  }

  const newUser = await User.create({
    username: username,
    displayName: displayName,
    email: email,
    password: await encryptPassword(password),
    photo: photo,
  });

  if (newUser) {
    generateToken(res, newUser.username);
    return res.status(201).json({
      code: 200,
      status: "ok",
      message: "success",
    });
  }
});

// @desc    Success Logged In User Data
// @route   GET /api/v1/user
// @access  Private
const getLoggedInUser = asyncHandler(async (req, res) => {
  if (req.user) {
    return res.status(200).json({
      code: 200,
      status: "ok",
      data: {
        userId: req.user?.userId,
        displayName: req.user?.displayName,
        email: req.user?.email,
        username: req.user?.username,
        photo: req.user?.photo,
      },
    });
  }
});

// @desc    Update User Info
// @route   PUT /api/v1/user
// @access  Private
const editUser = asyncHandler(async (req, res) => {
  const existingUser = await User.findByPk(req.user?.userId);
  if (!existingUser) {
    return res.status(404).json({ message: "User Not Found" });
  }

  const { displayName, password, photo } = req.body;
  existingUser.displayName = displayName || existingUser.displayName;

  if (password) {
    existingUser.password = await encryptPassword(password);
  }

  if (photo != undefined || photo != null) {
    if (existingUser?.photo !== null && existingUser?.photo !== "") {
      const photoLocation = existingUser?.photo.replace(`${req.get("host")}/api/v1/asset/img/`, "");
      const deletedImgPath = path.join(__dirname, "..", "public/uploads", photoLocation);
      if (fs.existsSync(deletedImgPath)) {
        await fs.promises.unlink(deletedImgPath, (err) => {
          if (err) {
            return res.status(500).json({ message: err });
          }
        });
      }
    }

    existingUser.photo = photo;
  }

  const updatedUser = await existingUser.save();
  return res.status(200).json({
    code: 200,
    status: "ok",
    data: {
      userId: updatedUser?.userId,
      displayName: updatedUser?.displayName,
      email: updatedUser?.email,
      username: updatedUser?.username,
      photo: updatedUser?.photo,
    },
  });
});

// @desc    Delete User Account
// @route   DELETE /api/v1/user
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
  const existingUser = await User.findByPk(req.user?.userId);
  if (!existingUser) {
    return res.status(404).json({ message: "User Not Found" });
  }

  let isImageDeleted = true;

  if (existingUser?.photo !== null && existingUser?.photo !== "") {
    const photoLocation = existingUser?.photo.replace(`${req.get("host")}/api/v1/asset/img/`, "");
    const deletedImgPath = path.join(__dirname, "..", "public/uploads", photoLocation);
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
    const deletedUser = await existingUser.destroy();
    if (deletedUser) {
      return res.status(200).json({
        code: 200,
        status: "ok",
      });
    }
  }
});

// @desc    User Login
// @route   POST /api/v1/user/login
// @access  Public
const userLogin = asyncHandler(async (req, res) => {
  const { account, password } = req.body;
  if (!account || !password) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  const userExists = await User.findOne({
    where: {
      [Op.or]: [{ username: account }, { email: account }],
    },
  });

  if (userExists) {
    const validPassword = await validatePassword(password, userExists.password);
    if (validPassword) {
      generateToken(res, userExists.username);
      return res.status(200).json({
        code: 200,
        status: "ok",
        data: {
          userId: userExists?.userId,
          displayName: userExists?.displayName,
          email: userExists?.email,
          username: userExists?.username,
          photo: userExists?.photo,
        },
      });
    }

    return res.status(401).json({ message: "Invalid Credentials" });
  }

  return res.status(404).json({ message: "User Not Found" });
});

// @desc    User Logout
// @route   POST /api/v1/user/logout
// @access  Public
const userLogout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.status(200).json({
    code: 200,
    status: "ok",
    message: "logout success",
  });
});

module.exports = {
  registerUser,
  getLoggedInUser,
  editUser,
  deleteUser,
  userLogin,
  userLogout,
};
