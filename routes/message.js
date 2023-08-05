const router = require("express").Router();

const { createMsg, updateMsg } = require("../controllers/message");

router.route("/").post(createMsg);

router.route("/:id").patch(updateMsg);

module.exports = router;
