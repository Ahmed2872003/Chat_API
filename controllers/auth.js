const User = require("../models/user");

const { StatusCodes } = require("http-status-codes");

const customError = require("../errors/customError");

const login = async (req, res) => {
  const token = req.user.createJWT();

  const user = { ...req.user }._doc;

  delete user.email;
  delete user.password;
  delete user.active;

  res.status(StatusCodes.OK).json({
    token,
    user,
  });
};

const signup = async (req, res) => {
  const user = await User.create(req.body);

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    token,
    user: { name: user.name, id: user._id, createdAt: user.createdAt },
  });
};

module.exports = {
  login,
  signup,
};
