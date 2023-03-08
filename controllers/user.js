const User = require("../models/user");

const CustomAPIError = require("../errors/customError");

const getUser = async (req, res) => {
  const user = await User.findById(req.user.userID);

  if (!user)
    throw new CustomAPIError(`No user found with id: ${req.user.userID}`, 404);

  const { _id: id, name, createdAt } = user;

  res.status(200).json({ id, name, createdAt });
};

const getUserByID = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user)
    throw new CustomAPIError(`No user found with id: ${req.params.id}`, 404);

  const { _id: id, name, active } = user;

  res.status(200).json({ id, name, active });
};

const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.userID, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user)
    throw new CustomAPIError(`No user with that id: ${req.user.userID}`);

  res.status(200).json({ name: user.name });
};

module.exports = {
  getUser,
  updateUser,
  getUserByID,
};
