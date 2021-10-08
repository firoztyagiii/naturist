const router = require("express").Router();
const userController = require("../controller/userController");

router.route("/signup").post(userController.postSignup);
router.route("/login").post(userController.postLogin);

module.exports = router;
