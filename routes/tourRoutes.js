const router = require("express").Router();
const tourController = require("../controller/tourController");
const reviewRouter = require("../routes/reviewRoutes");

router.use("/:id/review", reviewRouter);

router
  .route("/:id")
  .patch(tourController.patchTour)
  .delete(tourController.deleteTour)
  .get(tourController.getTour);

router.route("/").get(tourController.getTours).post(tourController.postTour);

module.exports = router;
