const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const Users = sequelize.define("users", {
  userId: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  displayName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  photo: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
});

module.exports = Users;
