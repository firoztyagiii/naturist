const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config({
  path: "./config.env",
});

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(cors());
heroku;

const userRoute = require("./routes/userRoutes");
const tourRoute = require("./routes/tourRoutes");
const reviewRoute = require("./routes/reviewRoutes");
const globalError = require("./controller/globalErrorController");
const AppError = require("./utils/error");

//API Endpoints

app.use("/api/user", userRoute);
app.use("/api/tour", tourRoute);
app.use("/api/review", reviewRoute);

app.use("/", (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "Use /api endpoints",
  });
});

app.use("*", (req, res, next) => {
  next(new AppError(404, "Page not found"));
});

app.use(globalError);

module.exports = app;
