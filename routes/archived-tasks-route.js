const express = require("express");
const router = express.Router();
const controller = require("../controller/archived-tasks-controller");

router.route("/").get(controller.getAllArchivedTasks).patch(controller.openTask);
router.route("/:task_id").get(controller.getArchivedTask);

module.exports = router;
