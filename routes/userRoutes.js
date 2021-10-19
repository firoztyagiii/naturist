const router = require("express").Router();
const userController = require("../controller/userController");
const authController = require("../controller/authController");

//Login & Signup
router.route("/signup").post(userController.postSignup);
router.route("/login").post(userController.postLogin);
router.route("/logout").get(userController.logout);

router
  .route("/about-me")
  .get(authController.isLoggedIn, userController.aboutMe);

//Password Reset
router.route("/forgot-password").post(userController.forgotPassword);
router.route("/reset-password").post(userController.resetPassword);
router
  .route("/update-email")
  .post(authController.isLoggedIn, userController.verifyEmail);
//Authentication
router.route("/activate-account").get(userController.activateAccount);
router.route("/2fa/:token").post(userController.twoFA);

//Update Me
router
  .route("/update-me/password")
  .post(authController.isLoggedIn, userController.updateMePassword);

router
  .route("/update-me/info")
  .post(authController.isLoggedIn, userController.updateMeInfo);

router
  .route("/update-me/email")
  .post(authController.isLoggedIn, userController.updateMeEmail);

module.exports = router;
