const mongoose = require("mongoose");
const MemberModel = mongoose.model("Member");
const bcrypt = require("bcrypt");
const saltRounds = 12;

exports.addNewMember = (req, res, next) => {
  let newMember = new MemberModel({
    fullName: req.body.fullName,
    email: req.body.email,
  });
  bcrypt
    .hash(req.body.password, saltRounds)
    .then((hash) => {
      newMember.password = hash;
      return newMember.save();
    })
    .then((member) => {
      res.status(201).json({message: "ok", member});
    })
    .catch((err) => next(err));
};
