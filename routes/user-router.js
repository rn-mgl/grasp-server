const express = require("express");
const router = express.Router();
const controller = require("../controller/user-controller");

router.route("/:user_id/user-classes").get(controller.getUserClass);
router.route("/:user_id/user-tasks").get(controller.getUserTasks);
router.route("/:user_id/task-count").get(controller.getUserTaskCounts);

router
  .route("/:user_id")
  .get(controller.getUser)
  .post(controller.joinClass)
  .patch(controller.updateUser);

module.exports = router;
