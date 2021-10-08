const express = require("express");
const dotenv = require("dotenv");

dotenv.config({
  path: "./config.env",
});

const app = express();

app.use(express.json());

const userRoute = require("./routes/userRoutes");
const globalError = require("./controller/globalErrorController");
const AppError = require("./utils/error");

app.use("/user", userRoute);

app.use("*", (req, res, next) => {
  next(new AppError(404, "Page not found"));
});

app.use(globalError);

module.exports = app;
