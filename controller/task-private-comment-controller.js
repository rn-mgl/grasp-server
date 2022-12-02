const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const PrivateTaskComments = require("../models/COMMENTS/PrivateTaskComments");

const createPrivateComment = async (req, res) => {
  const { user_id } = req.user;
  const task_id = req.originalUrl.split("/")[4];
  const { comment_text, comment_to } = req.body;
  const class_id = req.originalUrl.split("/")[2];

  const comment = new PrivateTaskComments(task_id, class_id, user_id, comment_to, comment_text);

  const data = await comment.createPrivateComment();

  if (!data) {
    throw new BadRequestError("Please properly enter comments.");
  }

  res.status(StatusCodes.CREATED).json(data);
};

const updatePrivateComment = async (req, res) => {
  const { user_id } = req.user;
  const { private_comment_id } = req.params;
  const { comment_text } = req.body;
  const task_id = req.originalUrl.split("/")[4];
  const class_id = req.originalUrl.split("/")[2];

  const data = await PrivateTaskComments.updatePrivateComment(
    user_id,
    class_id,
    private_comment_id,
    task_id,
    comment_text
  );

  if (!data) {
    throw new BadRequestError(`Please properly update your comments.`);
  }

  res.status(StatusCodes.OK).json({ data });
};

const getAllPrivateComments = async (req, res) => {
  const task_id = req.originalUrl.split("/")[4];
  const { comment_to } = req.query;
  const class_id = req.originalUrl.split("/")[2];
  const { user_id } = req.user;

  const data = await PrivateTaskComments.getAllPrivateComments(
    task_id,
    class_id,
    user_id,
    comment_to
  );

  if (!data) {
    throw new NotFoundError(`No comment in the task ${task_id} and class ${class_id}`);
  }

  res.status(StatusCodes.OK).json(data);
};

const getPrivateComment = async (req, res) => {
  const { private_comment_id } = req.params;
  const task_id = req.originalUrl.split("/")[4];
  const class_id = req.originalUrl.split("/")[2];
  const { user_id } = req.user;

  const data = await PrivateTaskComments.getPrivateComment(
    class_id,
    task_id,
    private_comment_id,
    user_id
  );

  if (!data) {
    throw new BadRequestError(`Error in getting task comment`);
  }

  res.status(StatusCodes.OK).json(data[0]);
};

const deletePrivateComment = async (req, res) => {
  const { user_id } = req.user;
  const { private_comment_id } = req.params;
  const class_id = req.originalUrl.split("/")[2];
  const task_id = req.originalUrl.split("/")[4];

  const data = await PrivateTaskComments.deletePrivateComment(
    user_id,
    class_id,
    private_comment_id,
    task_id
  );

  if (!data) {
    throw new NotFoundError(`No comment with the id ${comment_id}`);
  }

  res.status(StatusCodes.OK).json({ data });
};

module.exports = {
  createPrivateComment,
  updatePrivateComment,
  getAllPrivateComments,
  deletePrivateComment,
  getPrivateComment,
};
