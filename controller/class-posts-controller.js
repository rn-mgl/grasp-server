const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const ClassPost = require("../models/POSTS/ClassPost");

const createPost = async (req, res) => {
  const class_id = req.baseUrl.split("/")[2];

  const { post_main_topic, post_text, post_file, file_name } = req.body;
  const classPost = new ClassPost(
    class_id,
    req.user.user_id,
    post_main_topic,
    post_text,
    post_file,
    file_name
  );

  const data = await classPost.createPost();

  if (!data) {
    throw new BadRequestError(`You made wrong step in making the class post.`);
  }

  res.status(StatusCodes.CREATED).json({ data });
};

const getPost = async (req, res) => {
  const class_id = req.originalUrl.split("/")[2];
  const post_id = req.originalUrl.split("/")[4];
  const { user_id } = req.user;

  const data = await ClassPost.getPost(class_id, post_id, user_id);

  if (!data) {
    throw new BadRequestError(`No class post with id ${post_id} in class ${class_id}.`);
  }

  res.status(StatusCodes.OK).json(data[0]);
};

const updatePost = async (req, res) => {
  const { post_id, post_main_topic, post_text, post_file, file_name } = req.body;

  const data = await ClassPost.updatePost(
    post_id,
    post_main_topic,
    post_text,
    post_file,
    file_name
  );

  if (!data) {
    throw new NotFoundError(`No class post with the id ${post_id}`);
  }

  res.status(StatusCodes.OK).json({ data });
};

const getAllClassPostAndTaskPost = async (req, res) => {
  const { user_id } = req.user;
  const class_id = req.baseUrl.split("/")[2];

  const data = await ClassPost.getAllClassPostAndTaskPost(class_id, user_id);

  if (!data) {
    throw new BadRequestError(`Error in getting class posts and tasks`);
  }

  res.status(StatusCodes.OK).json(data);
};

const deletePost = async (req, res) => {
  const { post_id } = req.params;

  const data = await ClassPost.deletePost(post_id);

  if (!data) {
    throw new NotFoundError(`No post with the id ${post_id}`);
  }

  res.status(StatusCodes.OK).json(data[0]);
};

module.exports = { getAllClassPostAndTaskPost, createPost, deletePost, updatePost, getPost };
