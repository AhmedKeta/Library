const mongoose = require("mongoose");
const MemberModel = mongoose.model("Member");
const BookModel = mongoose.model("Book");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const membersPerPage = 12;

exports.getAllMembers = (req, res, next) => {
  MemberModel.find({}, { fullName: 1, email: 1 })
    .skip((req.params.page - 1) * membersPerPage)
    .limit(membersPerPage)
    .then((members) => {
      res.status(200).json({ message: "ok", members });
    })
    .catch((err) => next(err));
};

exports.getBooksByMemberId = (req, res, next) => {
  BookModel.findOne(
    { borrowed: req.params.id },
    { title: 1, auther: 1, pages: 1 }
  )
    .then((books) => {
      if (!books) {
        res.status(200).json({ message: "You don't have books!!" });
      }
      res.status(200).json({ message: "ok", books });
    })
    .catch((err) => next(err));
};

exports.updateMember = (req, res, next) => {
  let updatedMember = {
    fullName: req.body.fullName,
    email: req.body.email,
  };
  bcrypt
    .hash(req.body.password, saltRounds)
    .then((hash) => {
      updatedMember.password = hash;
      return MemberModel.updateOne({ _id: req.body.id }, { updatedMember });
    })
    .then((data) => {
      if (data.matchedCount) {
        res.status(201).json(data);
      } else {
        throw new Error("No member modified!!");
      }
    })
    .catch((err) => next(err));
};
