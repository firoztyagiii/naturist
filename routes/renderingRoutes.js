const router = require("express").Router();
const renderingController = require("../controller/renderingController");

router.route("/").get(renderingController.getIndex);

module.exports = router;
