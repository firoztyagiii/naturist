const router = require("express").Router();
const userController = require("../controller/userController");

router.route("/signup").post(userController.postSignup);

module.exports = router;
