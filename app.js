const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");

dotenv.config({
  path: "./config.env",
});

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "views");

app.use(cors({ credentials: true }));
app.use(helmet());
app.use(mongoSanitize());
app.use(xssClean());

const userRoute = require("./routes/userRoutes");
const tourRoute = require("./routes/tourRoutes");
const reviewRoute = require("./routes/reviewRoutes");
const globalError = require("./controller/globalErrorController");
const AppError = require("./utils/error");

//API Endpoints

app.use("/api/user", userRoute);
app.use("/api/tour", tourRoute);
app.use("/api/review", reviewRoute);

app.use("*", (req, res, next) => {
  next(new AppError(404, "Use /api endpoints"));
});

app.use(globalError);

module.exports = app;
