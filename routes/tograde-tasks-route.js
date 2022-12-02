const express = require("express");
const router = express.Router();
const controller = require("../controller/tograde-task-controller");

router.route("/").get(controller.getAllStudentsTasks).patch(controller.removeGradeTask);
router.route("/:student_user_id").get(controller.getStudentTaskToGrade).patch(controller.gradeTask);

module.exports = router;
