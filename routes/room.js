const express = require("express");

const router = express.Router();

const {
  createPrivateRoom,
  getAllRooms,
  getRoomMessages,
  updateRoomMsgs,
} = require("../controllers/room");

router.route("/").post(createPrivateRoom).get(getAllRooms);

router.route("/:id").get(getRoomMessages).patch(updateRoomMsgs);

module.exports = router;
