const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  let token = req?.cookies?.jwt;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userExists = await User.findOne(
      {
        where: { username: decoded.username },
      },
      {
        attributes: {
          exclude: ["password"],
        },
      }
    );

    if (!userExists) {
      return res.status(401).json({ message: "UnAuthorized" });
    }

    req.user = userExists;
    next();
  } else {
    return res.status(401).json({ message: "UnAuthorized" });
  }
});

module.exports = protect;
