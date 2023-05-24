const mongoose = require("mongoose");

exports.mongoConnect = (callback) => {
  mongoose
    .connect(process.env.DBURL)
    .then(() => {
      console.log("Cloud db server connected .....");
      callback();
    })
    .catch((err) => {
      console.log(err);
    });
};
