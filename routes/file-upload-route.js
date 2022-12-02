const express = require("express");
const router = express.Router();
const controller = require("../controller/file-upload-controller");

router.route("/").post(controller.uploadImage).delete(controller.deleteFile);

module.exports = router;
