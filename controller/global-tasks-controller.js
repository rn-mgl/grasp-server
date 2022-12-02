const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const ActiveTask = require("../models/TASKS/ActiveTask");

const getAllOngoingTasks = async (req, res) => {
  const { user_id } = req.user;

  const data = await ActiveTask.getAllOngoingTasks(user_id);
  if (!data) {
    throw new NotFoundError(`No user with the given id ${user_id}`);
  }
  res.status(StatusCodes.OK).json({ ongoing_data: data });
};

const getAllMissingTasks = async (req, res) => {
  const { user_id } = req.user;

  const data = await ActiveTask.getAllMissingTasks(user_id);
  if (!data) {
    throw new NotFoundError(`No user with the given id ${user_id}`);
  }
  res.status(StatusCodes.OK).json({ missing_data: data });
};

const getAllDoneTasks = async (req, res) => {
  const { user_id } = req.user;

  const data = await ActiveTask.getAllDoneTasks(user_id);
  if (!data) {
    throw new NotFoundError(`No user with the given id ${user_id}`);
  }
  res.status(StatusCodes.OK).json({ done_data: data });
};

module.exports = { getAllOngoingTasks, getAllMissingTasks, getAllDoneTasks };
