const express = require("express");
const router = express.Router();
const controller = require("../controller/class-students-controller");

router.route("/").get(controller.getAllStudents).delete(controller.unenrollClass);
router.route("/:student_id").get(controller.getStudent).delete(controller.removeStudents);
router.route("/:student_id/ongoing").get(controller.getStudentOngoingTasks);
router.route("/:student_id/missing").get(controller.getStudentMissingTasks);
router.route("/:student_id/done").get(controller.getStudentDoneTasks);
module.exports = router;
