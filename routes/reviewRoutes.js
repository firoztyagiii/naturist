const router = require("express").Router();
const authController = require("../controller/authController");
const reviewController = require("../controller/reviewController");

router.route("/").post(authController.isLoggedIn, reviewController.postReview);

module.exports = router;
