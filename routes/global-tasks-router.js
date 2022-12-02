const express = require("express");
const router = express.Router();
const controller = require("../controller/global-tasks-controller");

router.route("/ongoing").get(controller.getAllOngoingTasks);
router.route("/missing").get(controller.getAllMissingTasks);
router.route("/done").get(controller.getAllDoneTasks);

module.exports = router;
