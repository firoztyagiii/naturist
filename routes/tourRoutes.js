const router = require("express").Router();
const tourController = require("../controller/tourController");
const authController = require("../controller/authController");

router.route("/").post(tourController.postTour);
module.exports = router;
