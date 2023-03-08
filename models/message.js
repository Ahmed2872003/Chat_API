const mongoose = require("mongoose");

const msgSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    senderID: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    roomID: {
      type: mongoose.Types.ObjectId,
      ref: "rooms",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", msgSchema);
