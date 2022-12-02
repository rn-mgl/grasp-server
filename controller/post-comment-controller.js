const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const PostComments = require("../models/COMMENTS/PostComments");

const createComment = async (req, res) => {
  const { user_id } = req.user;
  const post_id = req.originalUrl.split("/")[4];
  const { comment_text } = req.body;
  const class_id = req.baseUrl.split("/")[2];
  const comment = new PostComments(post_id, class_id, user_id, comment_text);
  const data = await comment.createComment();

  if (!data) {
    throw new BadRequestError("Either the post does not exist or you made a wrong step.");
  }

  res.status(StatusCodes.CREATED).json({ data });
};

const updateComment = async (req, res) => {
  const { comment_id } = req.params;
  const { user_id } = req.user;
  const { comment_text } = req.body;
  const class_id = req.originalUrl.split("/")[2];
  const post_id = req.originalUrl.split("/")[4];

  const data = await PostComments.updateComment(
    comment_id,
    user_id,
    post_id,
    class_id,
    comment_text
  );

  if (data.affectedRows === 0) {
    throw new BadRequestError("Please enter proper comments.");
  }

  res.status(StatusCodes.OK).json({ data });
};

const deleteComment = async (req, res) => {
  const { user_id } = req.user;
  const { comment_id } = req.params;
  const post_id = req.originalUrl.split("/")[4];

  const data = await PostComments.deleteComment(user_id, comment_id, post_id);

  if (data.affectedRows === 0) {
    throw new NotFoundError(`No comment with id ${comment_id}`);
  }

  res.status(StatusCodes.OK).json({ data });
};

const getAllComments = async (req, res) => {
  const class_id = req.originalUrl.split("/")[2];

  const data = await PostComments.getAllPostComments(class_id);

  if (!data) {
    throw new BadRequestError(`Error in getting comment`);
  }

  res.status(StatusCodes.OK).json(data);
};

const getComment = async (req, res) => {
  const { comment_id } = req.params;
  const post_id = req.originalUrl.split("/")[4];
  const { user_id } = req.user;

  const data = await PostComments.getComment(post_id, comment_id, user_id);
  console.log(comment_id, post_id);
  if (!data) {
    throw new BadRequestError(`Error in getting comment`);
  }

  res.status(StatusCodes.OK).json(data[0]);
};

module.exports = { createComment, getAllComments, updateComment, deleteComment, getComment };
