const controller = require("../controller/class-posts-controller");
const express = require("express");
const router = express.Router();

router.route("/").get(controller.getAllClassPostAndTaskPost).post(controller.createPost);

router
  .route("/:post_id")
  .get(controller.getPost)
  .patch(controller.updatePost)
  .delete(controller.deletePost);

module.exports = router;
