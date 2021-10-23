const router = require("express").Router();
const authController = require("../controller/authController");
const checkoutController = require("../controller/checkoutController.js");

router.route("/checkout-session/:tourId").get(authController.isLoggedIn, checkoutController.getCheckoutSession);

module.exports = router;
