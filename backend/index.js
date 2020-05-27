const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const rootRouter = require("./routes");

const config = {
  mongoURL: "mongodb://localhost:27017/time-management",
  port: 4000
};

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURL, {
  useNewUrlParser: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback() {
  console.log("db connected");
});

var app = express();
app.use(cors());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", rootRouter);

app.listen(config.port, err => {
  if (err) {
    return console.log(err.message);
  }
  console.log("Listening port " + config.port);
});

module.exports = app;
