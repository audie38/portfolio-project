const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const Users = require("./User");
const Blogs = sequelize.define("blogs", {
  blogId: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  summary: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  cover: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
});

Blogs.belongsTo(Users, {
  constraint: true,
  onDelete: "CASCADE",
  foreignKey: "userId",
  targetKey: "userId",
});

Users.hasMany(Blogs, {
  foreignKey: "userId",
  sourceKey: "userId",
});

module.exports = Blogs;
