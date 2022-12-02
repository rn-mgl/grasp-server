const Student = require("../models/Student");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");

const submitTask = async (req, res) => {
  const { user_id } = req.user;
  const { task_id } = req.params;
  const class_id = req.baseUrl.split("/")[2];
  const { student_file, file_name } = req.body;

  const data = await Student.submitTask(user_id, task_id, class_id, student_file, file_name);

  if (!data) {
    throw new BadRequestError(`You made a wrong process in submitting`);
  }

  res.status(StatusCodes.OK).json({ data });
};

const unsubmitTask = async (req, res) => {
  const { user_id } = req.user;
  const { task_id } = req.params;
  const class_id = req.baseUrl.split("/")[2];

  const data = await Student.unsubmitTask(user_id, task_id, class_id);

  if (!data) {
    throw new BadRequestError(`You made a wrong process in submitting`);
  }

  res.status(StatusCodes.OK).json(data);
};

module.exports = { submitTask, unsubmitTask };
