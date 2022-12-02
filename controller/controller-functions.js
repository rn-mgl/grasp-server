const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const createJWT = (user_first_name, user_surname, user_gender, user_mail, user_id) => {
  return jwt.sign(
    { user_first_name, user_surname, user_gender, user_mail, user_id },
    "RgUkXp2s5v8y/B?E(H+MbQeThVmYq3t6",
    {
      expiresIn: "30d",
    }
  );
};

const comparePassword = async (candidate, dbPassword) => {
  const isMatch = await bcrypt.compare(candidate, dbPassword);
  return isMatch;
};

module.exports = { hashPassword, createJWT, comparePassword };
