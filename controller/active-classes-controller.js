const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const ActiveClass = require("../models/CLASS/ActiveClass");
const crypto = require("crypto");

const createClass = async (req, res) => {
  const { class_name, class_is_ongoing, class_subject, class_section, class_image, file_name } =
    req.body;
  const class_code = crypto.randomBytes(5).toString("hex");

  const newClass = new ActiveClass(
    req.user.user_id,
    class_code,
    class_name,
    class_subject,
    class_section,
    class_is_ongoing,
    class_image,
    file_name
  );
  const data = await newClass.createClass();

  if (!data) {
    throw new BadRequestError(
      "Either the class already exists or you made a wrong process in making a class."
    );
  }

  res.status(StatusCodes.CREATED).json({ msg: `class ${class_name} is created.` });
};

const getAllClass = async (req, res) => {
  const { user_id } = req.user;

  const data = await ActiveClass.getAllClass(user_id);
  if (!data) {
    throw new NotFoundError("No classes found.");
  }

  res.status(StatusCodes.OK).json({ classes: data });
};

const getClass = async (req, res) => {
  const { class_id } = req.params;
  const { user_id } = req.user;

  const data = await ActiveClass.getClass(class_id, user_id);

  if (!data) {
    throw new NotFoundError(`No class with id ${class_id}`);
  }

  const { class_data, upcoming_tasks_data } = data;

  res.status(StatusCodes.OK).json({ class_data: class_data[0], upcoming_tasks_data });
};

const updateClass = async (req, res) => {
  const { class_id, class_name, class_subject, class_section, class_image, file_name } = req.body;

  const data = await ActiveClass.updateClass(
    class_id,
    class_name,
    class_subject,
    class_section,
    class_image,
    file_name
  );

  if (!data) {
    throw new NotFoundError(`No class found with the given id ${class_id}.`);
  }

  res.status(StatusCodes.OK).json(data);
};

const archiveClass = async (req, res) => {
  const { class_id } = req.params;

  const data = await ActiveClass.archiveClass(class_id);

  if (!data) {
    throw new BadRequestError("Error in archiving class");
  }

  res.status(StatusCodes.OK).json(data);
};

module.exports = { createClass, getAllClass, getClass, updateClass, archiveClass };
