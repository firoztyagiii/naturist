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

const globalError = require("./controller/globalErrorController");
const AppError = require("./utils/error");

const userRoute = require("./routes/userRoutes");
const tourRoute = require("./routes/tourRoutes");
const reviewRoute = require("./routes/reviewRoutes");
const bookmarkRoute = require("./routes/bookmarkRoutes");
const checkoutRoute = require("./routes/checkoutRoute");
const bookingRoute = require("./routes/bookingRoutes");
const confirmCheckout = require("./controller/checkoutController");

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.DOMAIN,
    // origin: "http://localhost:2000",
  })
);

app.use(helmet());
app.use(mongoSanitize());
app.use(xssClean());
app.use(cookieParser());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

//API Endpoints

app.post("/confirm-checkout", confirmCheckout.confirmCheckout);

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
