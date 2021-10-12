const router = require("express").Router();
const renderingController = require("../controller/renderingController");

router.route("/").get(renderingController.getIndex);
router.route("/login").get(renderingController.getLogin);
router.route("/signup").get(renderingController.getSignUp);

module.exports = router;
