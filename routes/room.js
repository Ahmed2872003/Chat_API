const express = require("express");

const router = express.Router();

const { createPrivateRoom, getAllFriends } = require("../controllers/room");

router.route("/private").post(createPrivateRoom).get(getAllFriends);

module.exports = router;
