const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const AdminPost = require("../models/POSTS/AdminPost");

const createAdminPost = async (req, res) => {
  const { post_main_topic, post_text, post_file, file_name } = req.body;

  const adminPost = new AdminPost(
    req.user.user_id,
    post_main_topic,
    post_text,
    post_file,
    file_name
  );
  const data = await adminPost.createPost();
  if (data?.affectedRows === 0) {
    throw new BadRequestError("You made a wrong post, try again.");
  }
  res.status(StatusCodes.OK).json({ msg: "posted successfully" });
};

const getAllAdminPost = async (req, res) => {
  const data = await AdminPost.getAllPost();
  console.log(data);
  if (!data) {
    throw new NotFoundError("Posts are not available yet, try again later.");
  }
  res.status(StatusCodes.OK).json(data);
};

const getAdminPost = async (req, res) => {
  const { post_id } = req.params;

  const data = await AdminPost.getPost(post_id);

  if (data === undefined) {
    throw new NotFoundError("Posts are not available yet, try again later.");
  }

  res.status(StatusCodes.OK).json(data[0]);
};

const updateAdminPost = async (req, res) => {
  const { post_main_topic, post_text, post_file, file_name } = req.body;
  const { post_id } = req.params;

  const data = await AdminPost.updatePost(
    post_id,
    post_main_topic,
    post_text,
    post_file,
    file_name
  );

  if (data?.affectedRows === 0) {
    throw new BadRequestError("You made an error in your post update request.");
  }

  res.status(StatusCodes.OK).json({ msg: "post updated" });
};

const deleteAdminPost = async (req, res) => {
  const { post_id } = req.params;
  const data = await AdminPost.deletePost(post_id);

  if (data?.affectedRows === 0) {
    throw new NotFoundError("No post found with the given id.");
  }

  res.status(StatusCodes.OK).json(data);
};

module.exports = {
  createAdminPost,
  getAllAdminPost,
  getAdminPost,
  updateAdminPost,
  deleteAdminPost,
};
