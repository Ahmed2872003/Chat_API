const User = require("../models/user");

const { StatusCodes } = require("http-status-codes");

const customError = require("../errors/customError");

const login = async (req, res) => {
  const token = req.user.createJWT();

  const user = req.user.toObject();

  delete user.email;
  delete user.password;
  delete user.active;

  res.status(StatusCodes.OK).json({
    token,
    user,
  });
};

const signup = async (req, res) => {
  let user = await User.create(req.body);

  const token = user.createJWT();

  user = user.toObject();

  delete user.email;
  delete user.password;
  delete user.active;

  res.status(StatusCodes.CREATED).json({
    token,
    user,
  });
};

module.exports = {
  login,
  signup,
};
