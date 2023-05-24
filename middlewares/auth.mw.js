const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.get("authorization");
  if (!token) {
    let error = new Error("Not authrized.");
    error.status = 403;
    next(error);
  }
  try {
    let decodedToken = jwt.verify(token.split(" ")[1], process.env.secretToken);
    req.decodedToken = decodedToken;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (req.decodedToken.role === "admin") {
    next();
  } else {
    let error = new Error("Not authrized.");
    error.status = 403;
    next(error);
  }
};

module.exports.isMember = (req, res, next) => {
  if (req.decodedToken.role === "member") {
    next();
  } else {
    let error = new Error("Not authrized.");
    error.status = 403;
    next(error);
  }
};

module.exports.isSameMember = (req, res, next) => {
  if (
    req.decodedToken.role === "member" &&
    req.decodedToken.id === req.body.id
  ) {
    next();
  } else {
    let error = new Error("Not authrized.");
    error.status = 403;
    next(error);
  }
};

module.exports.isSameMember = (req, res, next) => {
  if (
    req.decodedToken.role === "member" &&
    req.decodedToken.id === req.params.id
  ) {
    next();
  } else {
    let error = new Error("Not authrized.");
    error.status = 403;
    next(error);
  }
};

module.exports.isSameParamMember = (req, res, next) => {
  if (req.decodedToken.role === "admin" || req.decodedToken.role === "member") {
    next();
  } else {
    let error = new Error("Not authrized.");
    error.status = 403;
    next(error);
  }
};
