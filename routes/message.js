const router = require("express").Router();

const { createMsg, getAllMessages } = require("../controllers/message");

router.post("/", createMsg);

router.route("/private/:roomID").get(getAllMessages);

module.exports = router;
