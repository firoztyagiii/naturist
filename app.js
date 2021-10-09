const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config({
  path: "./config.env",
});

const app = express();

app.use(cookieParser());
app.use(express.json());

const userRoute = require("./routes/userRoutes");
const tourRoute = require("./routes/tourRoutes");
const globalError = require("./controller/globalErrorController");
const AppError = require("./utils/error");

app.use("/user", userRoute);
app.use("/tour", tourRoute);

app.use("*", (req, res, next) => {
  next(new AppError(404, "Page not found"));
});

app.use(globalError);

module.exports = app;
