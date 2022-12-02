const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const PublicTaskComments = require("../models/COMMENTS/PublicTaskComments");

const createPublicComment = async (req, res) => {
  const { user_id } = req.user;
  const task_id = req.originalUrl.split("/")[4];
  const { comment_text } = req.body;
  const class_id = req.originalUrl.split("/")[2];

  const comment = new PublicTaskComments(user_id, task_id, class_id, comment_text);

  const data = await comment.createPublicComment();

  if (!data) {
    throw new BadRequestError("Please properly enter comments.");
  }

  res.status(StatusCodes.CREATED).json({ data });
};

const updatePublicComment = async (req, res) => {
  const { user_id } = req.user;
  const { public_comment_id } = req.params;
  const { comment_text } = req.body;
  const task_id = req.originalUrl.split("/")[4];
  const class_id = req.originalUrl.split("/")[2];

  const data = await PublicTaskComments.updatePublicComment(
    user_id,
    class_id,
    public_comment_id,
    task_id,
    comment_text
  );

  if (!data) {
    throw new BadRequestError(`Please properly update your comments.`);
  }

  res.status(StatusCodes.OK).json({ data });
};

const getAllPublicComments = async (req, res) => {
  const task_id = req.originalUrl.split("/")[4];
  const class_id = req.originalUrl.split("/")[2];

  const data = await PublicTaskComments.getAllPublicComments(task_id, class_id);

  if (!data) {
    throw new NotFoundError(`No comment in the task ${task_id} and class ${class_id}`);
  }

  res.status(StatusCodes.OK).json(data);
};

const deletePublicComment = async (req, res) => {
  const { user_id } = req.user;
  const { public_comment_id } = req.params;
  const class_id = req.originalUrl.split("/")[2];
  const task_id = req.originalUrl.split("/")[4];

  const data = await PublicTaskComments.deletePublicComment(
    user_id,
    class_id,
    public_comment_id,
    task_id
  );

  if (!data) {
    throw new NotFoundError(`No comment with the id ${public_comment_id}`);
  }

  res.status(StatusCodes.OK).json({ data });
};

const getPublicComment = async (req, res) => {
  const { public_comment_id } = req.params;
  const task_id = req.originalUrl.split("/")[4];
  const class_id = req.originalUrl.split("/")[2];
  const { user_id } = req.user;

  const data = await PublicTaskComments.getPublicComment(
    class_id,
    task_id,
    public_comment_id,
    user_id
  );

  if (!data) {
    throw new BadRequestError(`Error in getting task comment`);
  }

  res.status(StatusCodes.OK).json(data[0]);
};
module.exports = {
  createPublicComment,
  updatePublicComment,
  getAllPublicComments,
  deletePublicComment,
  getPublicComment,
};
