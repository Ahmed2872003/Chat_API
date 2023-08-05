const router = require("express").Router();

const {
  createMsg,
  getAllMessages,
  updateMsgs,
  updateMsg,
} = require("../controllers/message");

router.route("/").post(createMsg);

router.route("/private/:roomID").get(getAllMessages).patch(updateMsgs);

router.route("/:id").patch(updateMsg);

module.exports = router;
