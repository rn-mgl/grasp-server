const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const ClassFunctions = require("../models/MODEL FUNCTIONS/ClassFunctions");
const HandlerFunctions = require("../models/MODEL FUNCTIONS/HandlerFunctions");
const Student = require("../models/Student");

const getAllStudents = async (req, res) => {
  const class_id = req.baseUrl.split("/")[2];
  const data = await Student.getAllStudents(class_id);

  if (!data) {
    throw new NotFoundError(`No class with the id ${class_id}`);
  }

  res.status(StatusCodes.OK).json({ students: data });
};

const getStudent = async (req, res) => {
  const { student_id } = req.params;
  const class_id = req.baseUrl.split("/")[2];

  const data = await Student.getStudent(student_id, class_id);
  if (!data) {
    throw new NotFoundError(`No student with the id ${student_id} in class ${class_id}`);
  }

  res.status(StatusCodes.OK).json(data[0]);
};

const getStudentOngoingTasks = async (req, res) => {
  const student_id = req.originalUrl.split("/")[4];
  const class_id = req.originalUrl.split("/")[2];

  const data = await HandlerFunctions.getStudentOngoingTasks(class_id, student_id);

  if (!data) {
    throw new NotFoundError(`No student with the id ${student_id} in class ${class_id}`);
  }
  res.status(StatusCodes.OK).json(data);
};

const getStudentMissingTasks = async (req, res) => {
  const student_id = req.originalUrl.split("/")[4];
  const class_id = req.originalUrl.split("/")[2];
  const data = await HandlerFunctions.getStudentMissingTasks(class_id, student_id);
  if (!data) {
    throw new NotFoundError(`No student with the id ${student_id} in class ${class_id}`);
  }
  res.status(StatusCodes.OK).json(data);
};

const getStudentDoneTasks = async (req, res) => {
  const student_id = req.originalUrl.split("/")[4];
  const class_id = req.originalUrl.split("/")[2];
  const data = await HandlerFunctions.getStudentDoneTasks(class_id, student_id);
  if (!data) {
    throw new NotFoundError(`No student with the id ${student_id} in class ${class_id}`);
  }
  res.status(StatusCodes.OK).json(data);
};

const unenrollClass = async (req, res) => {
  const { user_id } = req.user;
  const class_id = req.baseUrl.split("/")[2];

  const data = await ClassFunctions.unenrollClass(user_id, class_id);

  if (!data) {
    throw new BadRequestError(`Error in leaving class`);
  }

  res.status(StatusCodes.OK).json(data);
};

const removeStudents = async (req, res) => {
  const { students } = req.body;
  const class_id = req.baseUrl.split("/")[2];
  const data = await Student.removeStudents(students, class_id);

  if (!data) {
    throw new BadRequestError(
      `Either you made a wrong step in removing students, or the students does not exists.`
    );
  }
  res.status(StatusCodes.OK).json({ data });
};

module.exports = {
  getAllStudents,
  getStudentOngoingTasks,
  getStudentMissingTasks,
  getStudentDoneTasks,
  getStudent,
  removeStudents,
  unenrollClass,
};
