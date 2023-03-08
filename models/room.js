const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({});

const FriendSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
  },
  friendID: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
  },
  roomID: {
    type: mongoose.Types.ObjectId,
    ref: "rooms",
    required: true,
  },
});

FriendSchema.index({ userID: 1, friendID: 1 }, { unique: true });

module.exports = {
  Room: mongoose.model("room", RoomSchema),
  Friend: mongoose.model("friend", FriendSchema),
};
