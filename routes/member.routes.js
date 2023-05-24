const path = require("path");
const express = require("express");
const { body } = require("express-validator");
const controller = require(path.join(
  __dirname,
  "..",
  "controllers",
  "member.controller"
));
const { isAdmin, isSameMember, isSameParamMember } = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "auth.mw"
));
const validationMessager = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "validation.mw"
));
const router = express.Router();

router
  .route("/member")
  .put(
    isSameMember,
    [
      body("id")
        .exists()
        .withMessage("Insert ID.")
        .isMongoId()
        .withMessage("teacher id must bo added as object ID."),
      body("password")
        .optional()
        .isStrongPassword()
        .withMessage("Insert valid pssword."),
      body("fullName")
        .optional()
        .isString()
        .withMessage("Valid name please!!")
        .isLength({ min: 5, max: 35 })
        .withMessage("Name must be between 5 to 35 char long."),
      body("email").optional().isEmail().withMessage("Invalid email address."),
    ],
    validationMessager,
    controller.updateMember
  );

router.route("/member/page/:page").get(isAdmin, controller.getAllMembers);

router.route("/member/books/:id").get(isSameParamMember, controller.getBooksByMemberId);

module.exports = router;
