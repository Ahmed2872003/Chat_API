const Cryptr = require("cryptr");
const User = require("../models/user");
const customError = require("../errors/customError");
const { StatusCodes } = require("http-status-codes");
const authentication = async (req, res, next) => {
  const { email: userEmail, password: userPass } = req.body;

  if (!userEmail || !userPass)
    throw new customError("Must provide both email and password", 404);

  const user = (await User.find({ email: userEmail }))[0];

  if (!user)
    throw new customError("That email doesn't exist", StatusCodes.UNAUTHORIZED);

  const isPasswordTrue = user.compare(userPass);

  if (!isPasswordTrue)
    throw new customError("Wrong password", StatusCodes.UNAUTHORIZED);

  req.user = user;
  next();
};

module.exports = authentication;
