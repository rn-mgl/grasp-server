const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const ToGrade = require("../models/ToGrade");

const getAllStudentsTasks = async (req, res) => {
  const class_id = req.baseUrl.split("/")[2];
  const task_id = req.baseUrl.split("/")[4];

  const data = await ToGrade.getAllStudentsTasks(class_id, task_id);

  if (!data) {
    throw new BadRequestError(`Error in getting students tasks`);
  }

  const { students, handler } = data;
  res.status(StatusCodes.OK).json({ students, handler: handler[0] });
};

const gradeTask = async (req, res) => {
  const path = req.originalUrl;
  const { student_user_id } = req.params;
  const class_id = path.split("/")[2];
  const task_id = path.split("/")[4];
  const { points } = req.body;

  const data = await ToGrade.gradeTask(class_id, task_id, student_user_id, points);

  if (!data) {
    throw new BadRequestError(`Error in grading task`);
  }

  res.status(StatusCodes.CREATED).json(data);
};

const getStudentTaskToGrade = async (req, res) => {
  const { student_user_id } = req.params;
  const class_id = req.baseUrl.split("/")[2];
  const task_id = req.baseUrl.split("/")[4];

  const data = await ToGrade.getStudentTaskToGrade(class_id, task_id, student_user_id);

  if (!data) {
    throw new BadRequestError(`Error in getting student task to grade`);
  }

  res.status(StatusCodes.OK).json(data[0]);
};

const removeGradeTask = async (req, res) => {
  const path = req.originalUrl;
  const class_id = path.split("/")[2];
  const task_id = path.split("/")[4];
  const { student_id } = req.body;

  const data = await ToGrade.removeGradeTask(class_id, task_id, student_id);

  if (!data) {
    throw new BadRequestError(`Error in grading task`);
  }

  res.status(StatusCodes.CREATED).json(data);
};

module.exports = {
  getAllStudentsTasks,
  gradeTask,
  removeGradeTask,
  getStudentTaskToGrade,
};
