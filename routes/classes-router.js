const express = require("express");
const router = express.Router();
const controller = require("../controller/active-classes-controller");

router
  .route("/")
  .get(controller.getAllClass)
  .post(controller.createClass)
  .patch(controller.updateClass);
router.route("/:class_id").get(controller.getClass).patch(controller.archiveClass);

module.exports = router;
