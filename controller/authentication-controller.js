const validator = require("validator");
const db = require("../db/connection");
const controller_fn = require("./controller-functions");
const User = require("../models/User");
const { UnauthenticatedError, BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const userSignUp = async (req, res) => {
  const { user_name, user_surname, user_gender, user_email, user_password } = req.body;
  if (!validator.isEmail(user_email)) {
    throw new BadRequestError("Invalid email");
  }
  if (user_password.length < 8) {
    throw new BadRequestError("Invalid password length");
  }
  const exist = await User.findByEmail(user_email);

  if (exist) {
    throw new BadRequestError(`Email already exists`);
  }

  const hashed_password = await controller_fn.hashPassword(user_password);
  const user = new User(user_name, user_surname, user_gender, user_email, hashed_password);

  if (!user) {
    throw new BadRequestError("You made a wrong input, try again");
  }

  const data = await user.createUser();
  const user_id = data.insertId;
  const token = controller_fn.createJWT(user_name, user_surname, user_gender, user_email, user_id);

  res.status(StatusCodes.CREATED).json({
    token,
    user: {
      name: `${user_name} ${user_surname}`,
      gender: user_gender,
      email: user_email,
      _id: user_id,
    },
  });
};

const userLogin = async (req, res) => {
  const { cand_user_email, cand_user_password } = req.body;

  const data = await User.findByEmail(cand_user_email);

  if (!data) {
    throw new NotFoundError("No user with the given credentials.");
  }

  const { user_id, user_name, user_surname, user_gender, user_email, user_password } = data;
  const matching_password = await controller_fn.comparePassword(cand_user_password, user_password);

  if (!matching_password) {
    throw new UnauthenticatedError("incorrect email / password");
  }

  const token = controller_fn.createJWT(user_name, user_surname, user_gender, user_email, user_id);

  res.status(StatusCodes.OK).json({
    token,
    user: {
      name: `${user_name} ${user_surname}`,
      gender: user_gender,
      email: user_email,
      _id: user_id,
    },
  });
};

module.exports = { userLogin, userSignUp };
