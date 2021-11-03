const router = require("express").Router({ mergeParams: true });
const bookmarkController = require("../controller/bookmarkController");
const authController = require("../controller/authController");

router
  .route("/")
  .post(authController.isLoggedIn, bookmarkController.postBookmark)
  .get(authController.isLoggedIn, bookmarkController.getBookmarks)
  .delete(authController.isLoggedIn, bookmarkController.deleteBookmark);

module.exports = router;
