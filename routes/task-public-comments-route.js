const express = require("express");
const router = express.Router();
const controller = require("../controller/task-public-comment-controller");

router.route("/").get(controller.getAllPublicComments).post(controller.createPublicComment);

router
  .route("/:public_comment_id")
  .patch(controller.updatePublicComment)
  .delete(controller.deletePublicComment)
  .get(controller.getPublicComment);

module.exports = router;
