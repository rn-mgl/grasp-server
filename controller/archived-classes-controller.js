const ArchivedClass = require("../models/CLASS/ArchivedClass");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");

const getAllArchivedClass = async (req, res) => {
  const { user_id } = req.user;

  const data = await ArchivedClass.getAllArchivedClass(user_id);

  if (!data) {
    throw new BadRequestError(`Error in finding archived classes`);
  }

  res.status(StatusCodes.OK).json(data);
};

const deleteClass = async (req, res) => {
  const { class_id } = req.params;

  const data = await ArchivedClass.deleteClass(class_id);

  if (!data) {
    throw new NotFoundError(`No class found with the id ${class_id}`);
  }

  res.status(StatusCodes.OK).json({ data: data[0] });
};

const restoreClass = async (req, res) => {
  const { class_id } = req.params;

  const data = await ArchivedClass.restoreClass(class_id);

  if (!data) {
    throw new BadRequestError(`Error in updating archived classes`);
  }

  res.status(StatusCodes.OK).json(data);
};

module.exports = { getAllArchivedClass, restoreClass, deleteClass };
