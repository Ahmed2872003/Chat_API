const mongoose = require("mongoose");
const crypto = require("crypto");

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
      index: true,
    },
  },
  { timestamps: true }
);

msgSchema.pre("save", function () {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    process.env.MESSAGE_KEY,
    process.env.MESSAGE_IV
  );
  let encrypted = cipher.update(this.content, "utf-8", "hex");
  encrypted += cipher.final("hex");
  this.content = encrypted;
});

msgSchema.virtual("decryptedText").get(function () {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    process.env.MESSAGE_KEY,
    process.env.MESSAGE_IV
  );
  let decrypted = decipher.update(this.content, "hex", "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
});

module.exports = mongoose.model("message", msgSchema);
