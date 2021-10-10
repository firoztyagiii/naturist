const router = require("express").Router();
const tourController = require("../controller/tourController");

router
  .route("/:id")
  .patch(tourController.patchTour)
  .delete(tourController.deleteTour)
  .get(tourController.getTour);

router.route("/").get(tourController.getTours).post(tourController.postTour);

module.exports = router;
