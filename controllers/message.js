const Msg = require("../models/message");

const mongoose = require("mongoose");

const Cryptr = require("cryptr");

const createMsg = async (req, res) => {
  const { roomID, content } = req.body;

  const msg = await Msg.create({ roomID, content, senderID: req.user.userID });

  res.status(201).json({ message: { ...msg.toObject(), content } });
};

const getAllMessages = async (req, res) => {
  const { roomID } = req.params;

  const msgs = await Msg.find({ roomID });

  const data = await (async () =>
    msgs.map((msg) => ({
      senderID: msg.senderID,
      roomID: msg.roomID,
      read: msg.read,
      content: msg.decryptedText,
      createdAt: msg.createdAt,
      _id: msg._id,
    })))();

  res.status(200).json({ data: { messages: data }, length: msgs.length });
};

const updateMsgs = async (req, res) => {
  await Msg.updateMany(
    { roomID: req.params.roomID, senderID: { $ne: req.user.userID } },
    req.body
  );
  res.sendStatus(200);
};

const updateMsg = async (req, res) => {
  await Msg.findByIdAndUpdate(req.params._id, req.body);
  res.sendStatus(200);
};
(async () => {})();

module.exports = {
  createMsg,
  getAllMessages,
  updateMsgs,
  updateMsg,
};
