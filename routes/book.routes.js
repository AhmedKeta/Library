const path = require("path");
const express = require("express");
const controller = require(path.join(
  __dirname,
  "..",
  "controllers",
  "book.controller"
));
const { isAdmin, isMember } = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "auth.mw"
));

const router = express.Router();
router.route("/book").post(isAdmin, controller.addNewBook);
router.route("/book/page/:page").get(isAdmin, controller.getAllBooks);
router
  .route("/book/available/page/:page")
  .get(isAdmin, controller.getAllAvailableBooks);
router
  .route("/book/borrowed/page/:page")
  .get(isAdmin, controller.getAllBorrowedBooks);
router.route("/book/borrow").put(isAdmin, controller.borrowToMember);
router.route("/book/return").put(isAdmin, controller.returnFromMember);
router.route("/book/search/:text").get(isMember, controller.searchInBooks);

module.exports = router;
