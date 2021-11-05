const router = require("express").Router();
const tourController = require("../controller/tourController");
const reviewRouter = require("../routes/reviewRoutes");
const validate = require("../utils/validateTour");
const bookmarkRouter = require("./bookmarkRoutes");
const upload = require("../utils/uploadFiles");

router
  .route("/")
  .get(tourController.getTours)
  .post(upload.single("headImg"), validate.checkBody, validate.areErrors, tourController.postTour);

router.route("/:id").patch(tourController.patchTour).delete(tourController.deleteTour).get(tourController.getTour);

router.use("/:tourId/bookmark", bookmarkRouter);
router.use("/:id/review", reviewRouter);

module.exports = router;
