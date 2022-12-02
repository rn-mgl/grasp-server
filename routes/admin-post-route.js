const express = require("express");
const router = express.Router();
const controller = require("../controller/admin-post-controller");

router.route("/").post(controller.createAdminPost).get(controller.getAllAdminPost);
router
  .route("/:post_id")
  .get(controller.getAdminPost)
  .patch(controller.updateAdminPost)
  .delete(controller.deleteAdminPost);

module.exports = router;
