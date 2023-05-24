const path = require("path");

module.exports = (error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ message: error + "" || "500 Internal Server Error" });
};
