const router = require("express").Router({ mergeParams: true });
const bookmarkController = require("../controller/bookmarkController");
const authController = require("../controller/authController");

router
  .route("/")
  .post(authController.isLoggedIn, bookmarkController.addToBookmark)
  .get(authController.isLoggedIn, bookmarkController.getBookmarks);

module.exports = router;
