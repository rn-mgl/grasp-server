const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const Student = require("../models/Student");
const User = require("../models/User");
const UserFunctions = require("../models/MODEL FUNCTIONS/UserFunctions");

const getUser = async (req, res) => {
  const { user_id } = req.params;

  const data = await User.getUser(user_id);

  if (!user_id) {
    throw new NotFoundError(`No user with the id ${user_id}.`);
  }

  res.status(StatusCodes.OK).json(data[0]);
};

const getUserClass = async (req, res) => {
  const user_id = req.originalUrl.split("/")[2];

  const data = await UserFunctions.getAllMyClasses(user_id);

  if (!user_id) {
    throw new NotFoundError(`No user with the id ${user_id}.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const getUserTasks = async (req, res) => {
  const user_id = req.originalUrl.split("/")[2];

  const data = await UserFunctions.getAllMyTasks(user_id);

  if (!user_id) {
    throw new NotFoundError(`No user with the id ${user_id}.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const getUserTaskCounts = async (req, res) => {
  const user_id = req.originalUrl.split("/")[2];

  const data = await UserFunctions.getMyClassAndTaskCount(user_id);

  if (!user_id) {
    throw new NotFoundError(`No user with the id ${user_id}.`);
  }

  res.status(StatusCodes.OK).json(data[0]);
};

const joinClass = async (req, res) => {
  const { user_id } = req.user;
  const { class_code } = req.body;

  const joined_status = await Student.joinClass(user_id, class_code);

  if (!joined_status) {
    throw new NotFoundError(`No class with code ${class_code}`);
  }

  res.status(StatusCodes.OK).json({ joined_status });
};

const updateUser = async (req, res) => {
  const { user_id, user_name, user_surname, user_gender, user_image } = req.body;

  const data = await User.updateUser(user_id, user_image, user_name, user_surname, user_gender);

  if (!data) {
    throw new BadRequestError(`Error in changing profile`);
  }

  res.status(StatusCodes.OK).json(data);
};
module.exports = { getUser, joinClass, updateUser, getUserClass, getUserTasks, getUserTaskCounts };
