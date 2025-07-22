//utils.js
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const saltRounds = 10;

const generateUniqueId = () => {
  return uuidv4();
};

async function encryptPassword(password) {
  return bcrypt.hash(password, saltRounds);
}

module.exports = {
  generateUniqueId,
  encryptPassword,
};
