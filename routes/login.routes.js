const path = require("path");
const express = require("express");
const controller = require(path.join(
  __dirname,
  "..",
  "controllers",
  "login.controller"
));
const router = express.Router();

router.route("/login").post(controller.login);
router.route("/login/admin").post(controller.loginAdmin);

module.exports = router;
