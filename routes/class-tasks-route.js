const express = require("express");
const router = express.Router();
const controller = require("../controller/class-tasks-controller");

router
  .route("/")
  .get(controller.getAllClassTasks)
  .post(controller.createTask)
  .patch(controller.archiveTask);
router
  .route("/:task_id")
  .get(controller.getStudentTask)
  .patch(controller.updateTask)
  .delete(controller.deleteTask);

module.exports = router;
