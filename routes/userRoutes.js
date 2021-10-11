const router = require("express").Router();
const userController = require("../controller/userController");
const authController = require("../controller/authController");

router
  .route("/activate-account/:activationToken")
  .get(userController.activateAccount);

router.route("/signup").post(userController.postSignup);
router
  .route("/about-me")
  .get(authController.isLoggedIn, userController.aboutMe);

router.route("/login").post(userController.postLogin);

module.exports = router;
