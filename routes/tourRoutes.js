const router = require("express").Router();
const tourController = require("../controller/tourController");
const authController = require("../controller/authController");

router.route("/").get(tourController.getTours).post(tourController.postTour);

module.exports = router;
