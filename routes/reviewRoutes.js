const router = require("express").Router({ mergeParams: true });
const authController = require("../controller/authController");
const reviewController = require("../controller/reviewController");

router
  .route("/")
  .post(authController.isLoggedIn, reviewController.postReview)
  .get(reviewController.getReviews);

router.route("/:reviewId").get(reviewController.getReview);

module.exports = router;
