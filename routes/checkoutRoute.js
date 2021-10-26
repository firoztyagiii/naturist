const router = require("express").Router();
const authController = require("../controller/authController");
const checkoutController = require("../controller/checkoutController.js");

router.route("/checkout-session/:tourId").get(authController.isLoggedIn, checkoutController.getCheckoutSession);
// router.route("/confirm-checkout").post(checkoutController.confirmCheckout);

module.exports = router;
