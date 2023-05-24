const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const MemberModel = mongoose.model("Member");
const jwt = require("jsonwebtoken");


exports.login = (req, res, next) => {
  MemberModel.findOne({ email: req.body.email })
    .then((member) => {
      if (member) {
        req.body.id = member._id;
        return bcrypt.compare(req.body.password, member.password);
      } else {
        let error = new Error("Email or password is wrong.");
        error.status = 401;
        throw error;
      }
    })
    .then((result) => {
      if (result) {
        let token = jwt.sign(
          {
            id: req.body.id,
            role: "member",
          },
          process.env.secretToken,
          { expiresIn: "8h" }
        );
        res.status(200).json({ message: "ok", id: req.body.id, token });
      } else {
        let error = new Error("Email or password is wrong.");
        error.status = 401;
        throw error;
      }
    })
    .catch((err) => next(err));
};

exports.loginAdmin = (req, res, next) => {
  if (req.body.email === "a@a.a" && req.body.password === "123") {
    let token = jwt.sign(
      {
        role: "admin",
      },
      process.env.secretToken,
      { expiresIn: "8h" }
    );
    res.status(200).json({ message: "ok", token });
  } else {
    let error = new Error("Email or password is wrong.");
    error.status = 401;
    next(error);
  }
};
