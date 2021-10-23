const router = require("express").Router();
const authController = require("../controller/authController");
const bookingController = require("../controller/bookingController");

router.route("/my-bookings").get(authController.isLoggedIn, bookingController.getBookings);

module.exports = router;
