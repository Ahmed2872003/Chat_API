const Message = require("../models/message");

const User = require("../models/user");

const { Room, Friend } = require("../models/room");

const mongoose = require("mongoose");

const CustomAPIError = require("../errors/customError");

const { StatusCodes } = require("http-status-codes");

const createPrivateRoom = async (req, res) => {
  const { friendID } = req.body;

  // Check if that user exist in users collection
  const f = await User.findById(friendID);

  if (!f) throw new CustomAPIError(`No user with that id: ${friendID}`, 404);

  const room = await Room.create({});

  const friend = await Friend.create({
    userID: req.user.userID,
    friendID,
    roomID: room._id,
  });
  // make also a friendship for other user
  await Friend.create({
    userID: friendID,
    friendID: req.user.userID,
    roomID: room._id,
  });

  res.status(StatusCodes.CREATED).json({ roomID: room._id });
};

const getAllFriends = async (req, res) => {
  const friends = await Friend.aggregate([
    {
      $match: { userID: mongoose.Types.ObjectId(req.user.userID) },
    },
    {
      $lookup: {
        from: "users",
        localField: "friendID",
        foreignField: "_id",
        as: "friend",
      },
    },
    {
      $unwind: "$friend",
    },
    {
      $project: {
        "friend._id": 1,
        "friend.name": 1,
        "friend.active": 1,
        _id: 0,
        roomID: 1,
      },
    },
  ]);

  res.status(200).json({ friends });
};

module.exports = {
  createPrivateRoom,
  getAllFriends,
};
