const router = require("express").Router();
const tourController = require("../controller/tourController");
const reviewRouter = require("../routes/reviewRoutes");
const bookmarkRouter = require("./bookmarkRoutes");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const validateTourData = require("../utils/validateTourData");

const multipleUploads = upload.fields([
  { name: "headImg", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

router.route("/").get(tourController.getTours).post(multipleUploads, validateTourData, tourController.postTour);

router.route("/:id").patch(tourController.patchTour).delete(tourController.deleteTour).get(tourController.getTour);

router.use("/:tourId/bookmark", bookmarkRouter);
router.use("/:id/review", reviewRouter);

module.exports = router;
