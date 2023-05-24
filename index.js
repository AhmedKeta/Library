const path = require("path");
const database = require(path.join(__dirname, "utils", "database"));
const express = require("express");
const morgan = require("morgan");
require(path.join(__dirname, "models"));
const corsMW = require(path.join(__dirname, "middlewares", "cors.mw"));
const authMW = require(path.join(__dirname, "middlewares", "auth.mw"));
const errorMW = require(path.join(__dirname, "middlewares", "error.mw"));
const notFoundMW = require(path.join(__dirname, "middlewares", "404.mw"));
const registerRoute = require(path.join(__dirname, "routes", "register.routes"))
const loginRoute = require(path.join(__dirname, "routes", "login.routes"))
const memberRoute = require(path.join(__dirname, "routes", "member.routes"))
const bookRoute = require(path.join(__dirname, "routes", "book.routes"))
const compression = require("compression");
require("dotenv").config();
const app = express();

app.use(
  morgan(
    "url: :url\nmethod: :method\nStatus: :status\ncontent-length: :res[content-length] - response-time: :response-time ms"
  )
);

app.use(corsMW);
app.use(compression());
app.use(express.json());
app.use(registerRoute);
app.use(loginRoute);
app.use(authMW);
app.use(memberRoute);
app.use(bookRoute);
app.use(notFoundMW);
app.use(errorMW);

database.mongoConnect(() => {
  app.listen(process.env.PORT, () => {
    console.log("Express is listening ........");
  });
});
