const bcrypt = require("bcryptjs");

const encryptPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  return hashedPassword;
};

const validatePassword = async (plainPassword, savedPassword) => {
  const result = await bcrypt.compare(plainPassword, savedPassword);
  return result;
};

module.exports = {
  encryptPassword,
  validatePassword,
};
