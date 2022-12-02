const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const ActiveTask = require("../models/TASKS/ActiveTask");

const createTask = async (req, res) => {
  const {
    task_main_topic,
    task_text,
    task_submission_date,
    task_points,
    task_open,
    task_file,
    file_name,
  } = req.body;

  const class_id = req.baseUrl.split("/")[2];

  const task = new ActiveTask(
    class_id,
    req.user.user_id,
    task_main_topic,
    task_text,
    task_submission_date,
    task_points,
    task_open,
    task_file === "" ? null : task_file,
    file_name
  );

  const data = await task.createTask();

  if (!data) {
    throw new BadRequestError(`You made an error in assigning activities.`);
  }

  res.status(StatusCodes.CREATED).json({ data });
};

const getAllClassTasks = async (req, res) => {
  const class_id = req.baseUrl.split("/")[2];
  const { user_id } = req.user;

  const data = await ActiveTask.getAllClassTasks(class_id, user_id);

  if (!data) {
    throw new NotFoundError(`No class with the id ${class_id}`);
  }

  const { task, handler } = data;

  res.status(StatusCodes.OK).json({ task, handler: handler[0].class_handler });
};

const getStudentTask = async (req, res) => {
  const { user_id } = req.user;
  const { task_id } = req.params;
  const class_id = req.originalUrl.split("/")[2];

  const data = await ActiveTask.getStudentTask(task_id, user_id, class_id);

  if (!data) {
    throw new NotFoundError("No task found with the given data.");
  }
  res.status(StatusCodes.OK).json(data[0]);
};

const updateTask = async (req, res) => {
  const { task_id } = req.params;

  const { task_main_topic, task_text, task_submission_date, task_points, task_file } = req.body;

  const data = await ActiveTask.updateTask(
    task_id,
    task_main_topic,
    task_text,
    task_submission_date,
    task_points,

    task_file === "" ? null : task_file
  );

  if (!data) {
    throw new NotFoundError(`No task found with the id ${task_id}`);
  }

  res.status(StatusCodes.OK).json({ data });
};

const deleteTask = async (req, res) => {
  const { task_id } = req.params;

  const data = await ActiveTask.removeTask(task_id);

  if (!data) {
    throw new NotFoundError(`No task found with the id ${task_id}`);
  }

  res.status(StatusCodes.OK).json(data[0]);
};

const archiveTask = async (req, res) => {
  const { task_id } = req.body;

  const data = await ActiveTask.archiveTask(task_id);

  if (!data) {
    throw new BadRequestError(`Error in archiving task`);
  }

  res.status(StatusCodes.OK).json(data);
};

module.exports = {
  createTask,
  getStudentTask,
  updateTask,
  deleteTask,
  getAllClassTasks,
  archiveTask,
};
