const Msg = require("../models/message");

const mongoose = require("mongoose");

const createMsg = async (req, res) => {
  const { roomID, content } = req.body;

  const msg = await Msg.create({ roomID, content, senderID: req.user.userID });

  res.status(201).json({ message: { ...msg } });
};

const getAllMessages = async (req, res) => {
  const { roomID } = req.params;

  const msgs = await Msg.aggregate([
    {
      $match: { roomID: mongoose.Types.ObjectId(roomID) },
    },
    {
      $project: {
        content: 1,
        read: 1,
        senderID: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!msgs.length) {
    res.status(200).json({ data: { messages: msgs }, length: msgs.length });
    return;
  }

  res.status(200).json({ data: { messages: msgs }, length: msgs.length });
};

module.exports = {
  createMsg,
  getAllMessages,
};
