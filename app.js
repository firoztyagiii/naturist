const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
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

const whiteListDomain = [
  "https://naturist-front.herokuapp.com",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://localhost:9090",
];

app.use((req, res, next) => {
  const domain = req.headers.origin;
  if (whiteListDomain.includes(domain)) {
    res.setHeader("Access-Control-Allow-Origin", domain);
  }
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

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
  next(new AppError(404, "Use /api/ endpoints"));
});

app.use(globalError);

module.exports = app;
