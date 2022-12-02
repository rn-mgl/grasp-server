const controller = require("../controller/global-students-controller");
const express = require("express");
const router = express.Router();

router.route("/:task_id").patch(controller.submitTask);

module.exports = router;
