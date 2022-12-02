const express = require("express");
const router = express.Router();
const controller = require("../controller/authentication-controller");

router.post("/signup", controller.userSignUp);
router.post("/login", controller.userLogin);

module.exports = router;
