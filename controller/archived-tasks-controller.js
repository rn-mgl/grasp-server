const ArchivedTask = require("../models/TASKS/ArchivedTask");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllArchivedTasks = async (req, res) => {
  const class_id = req.baseUrl.split("/")[2];

  const data = await ArchivedTask.getAllArchivedTasks(class_id);

  if (!data) {
    throw new BadRequestError(`Error in getting archived tasks`);
  }

  res.status(StatusCodes.OK).json(data);
};

const getArchivedTask = async (req, res) => {
  const class_id = req.baseUrl.split("/")[2];
  const { task_id } = req.params;
  const { user_id } = req.user;

  const data = await ArchivedTask.getArchivedTask(task_id, user_id, class_id);

  if (!data) {
    throw new BadRequestError(`Error in getting archived task`);
  }

  res.status(StatusCodes.OK).json(data);
};

const openTask = async (req, res) => {
  const { task_id } = req.body;
  const data = await ArchivedTask.openTask(task_id);
  if (!data) {
    throw new BadRequestError(
      `There was a problem in assigning assignments, please check your input.`
    );
  }
  res.status(StatusCodes.CREATED).json({ data });
};

module.exports = { getAllArchivedTasks, getArchivedTask, openTask };
