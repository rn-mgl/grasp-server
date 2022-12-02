const express = require("express");
const router = express.Router();
const controller = require("../controller/handler-tasks-controller");

router.route("/").get(controller.getAllAssignedTask);
router.route("/:task_id").get(controller.getHandlerTask);

module.exports = router;
