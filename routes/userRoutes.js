const router = require("express").Router();
const userController = require("../controller/userController");
const authController = require("../controller/authController");

//Login & Signup
router.route("/signup").post(userController.postSignup);
router.route("/login").post(userController.postLogin);
router.route("/logout").get(userController.logout);

router.route("/about-me").get(authController.isLoggedIn, userController.aboutMe);

//Update password or EMail
router.route("/forgot-password").post(userController.forgotPassword);
router.route("/reset-password").post(userController.resetPassword);
router.route("/update-email").post(userController.verifyEmail);

//Authentication
router.route("/activate-account").get(userController.activateAccount);
router.route("/2fa").post(userController.twoFA);

//Update Me
router.route("/update-me/email").post(authController.isLoggedIn, userController.updateMeEmail);
router.route("/update-me/password").post(authController.isLoggedIn, userController.updateMePassword);
router.route("/update-me/info").post(authController.isLoggedIn, userController.updateMeInfo);
router.route("/update-me/enable2fa").get(authController.isLoggedIn, userController.enable2fa);
router.route("/update-me/turnoff2fa").get(authController.isLoggedIn, userController.turnOff2Fa);

// router.route("/top").get(userController.topFive);

module.exports = router;
