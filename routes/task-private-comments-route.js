const express = require("express");
const router = express.Router();
const controller = require("../controller/task-private-comment-controller");

router.route("/").get(controller.getAllPrivateComments).post(controller.createPrivateComment);

router
  .route("/:private_comment_id")
  .patch(controller.updatePrivateComment)
  .delete(controller.deletePrivateComment)
  .get(controller.getPrivateComment);

module.exports = router;
