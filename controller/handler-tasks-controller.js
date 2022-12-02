const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const Handler = require("../models/Handler");

const getHandlerTask = async (req, res) => {
  const path = req.originalUrl;

  const class_id = path.split("/")[2];
  const task_id = path.split("/")[4];

  const data = await Handler.getHandlerTask(task_id, class_id);

  if (!data) {
    throw new NotFoundError(`No task in with id ${task_id}`);
  }

  const { task_data } = data;

  res.status(StatusCodes.OK).json({ task_data });
};

const getAllAssignedTask = async (req, res) => {
  const path = req.originalUrl;
  const class_id = path.split("/")[2];
  const { user_id } = req.user;

  const data = await Handler.getAllAssignedTasks(class_id, user_id);

  if (!data) {
    throw new NotFoundError(`No task in class with id ${class_id}`);
  }

  res.status(StatusCodes.OK).json(data);
};

module.exports = {
  getHandlerTask,
  getAllAssignedTask,
};
