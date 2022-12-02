const express = require("express");
const router = express.Router();
const controller = require("../controller/post-comment-controller");

router.route("/").get(controller.getAllComments).post(controller.createComment);
router
  .route("/:comment_id")
  .patch(controller.updateComment)
  .delete(controller.deleteComment)
  .get(controller.getComment);

module.exports = router;
