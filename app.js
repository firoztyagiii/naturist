const dotenv = require("dotenv");

dotenv.config({
  path: "./config.env",
});

const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const bodyParser = require("body-parser");

const globalError = require("./controller/globalErrorController");
const AppError = require("./utils/error");

const userRoute = require("./routes/userRoutes");
const tourRoute = require("./routes/tourRoutes");
const reviewRoute = require("./routes/reviewRoutes");
const bookmarkRoute = require("./routes/bookmarkRoutes");
const checkoutRoute = require("./routes/checkoutRoute");
const bookingRoute = require("./routes/bookingRoutes");
const checkoutController = require("./controller/checkoutController.js");

const app = express();

app.post("/confirm-checkout", express.raw(), checkoutController.confirmCheckout);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "views");

app.use(helmet());
app.use(mongoSanitize());
app.use(xssClean());
app.use(cors({ credentials: true, origin: "https://naturist-front.herokuapp.com" }));

//API Endpoints
app.use("/api/user", userRoute);
app.use("/api/tour", tourRoute);
app.use("/api/review", reviewRoute);
app.use("/api/bookmark", bookmarkRoute);
app.use("/api/checkout", checkoutRoute);
app.use("/api/booking", bookingRoute);

app.use("*", (req, res, next) => {
  next(new AppError(404, "Use /api/ endpoints"));
});

app.use(globalError);

module.exports = app;
