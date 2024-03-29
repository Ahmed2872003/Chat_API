const Message = require("../models/message");

const mongoose = require("mongoose");

const Cryptr = require("cryptr");

const createMsg = async (req, res) => {
  const { roomID, content } = req.body;

  const msg = await Message.create({
    roomID,
    content,
    senderID: req.user.userID,
  });

  res.status(201).json({ message: { ...msg.toObject(), content } });
};

const updateMsg = async (req, res) => {
  const msg = await Message.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (req.body.content) await msg.save();

  res.sendStatus(200);
};

module.exports = {
  createMsg,
  updateMsg,
};
