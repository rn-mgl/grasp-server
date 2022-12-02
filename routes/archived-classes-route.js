const express = require("express");
const router = express.Router();
const controller = require("../controller/archived-classes-controller");

router.route("/").get(controller.getAllArchivedClass);
router.route("/:class_id").patch(controller.restoreClass).delete(controller.deleteClass);

module.exports = router;
