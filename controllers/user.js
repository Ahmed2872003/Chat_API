const User = require("../models/user");

const CustomAPIError = require("../errors/customError");
const { StatusCodes } = require("http-status-codes");

const getUser = async (req, res) => {
  const user = (await User.findById(req.user.userID)).toObject();

  if (!user)
    throw new CustomAPIError(`No user found with id: ${req.user.userID}`, 404);

  delete user.email;
  delete user.password;
  delete user.active;

  res.status(200).json(user);
};

const getUserByID = async (req, res) => {
  const user = (await User.findById(req.params.id)).toObject();

  if (!user)
    throw new CustomAPIError(`No user found with id: ${req.params.id}`, 404);

  delete user.email;
  delete user.password;

  res.status(200).json(user);
};

const updateUser = async (req, res) => {
  let user = await User.findById(req.user.userID);

  if (!user)
    throw new CustomAPIError(
      `No user with that id: ${req.user.userID}`,
      StatusCodes.NOT_FOUND
    );

  if (req.body.password) {
    user.password = req.body.password;
    await user.save();
  }

  res.status(200).json({ name: user.name });
};

module.exports = {
  getUser,
  updateUser,
  getUserByID,
};
