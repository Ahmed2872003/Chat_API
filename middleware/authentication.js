const Cryptr = require("cryptr");
const User = require("../models/user");
const customError = require("../errors/customError");
const { StatusCodes } = require("http-status-codes");
const authentication = async (req, res, next) => {
  const { email: userEmail, password: userPass } = req.body;

  if (!userEmail || !userPass)
    throw new customError(
      "Must provide both email and password",
      StatusCodes.BAD_REQUEST
    );

  const user = await User.findOne({ email: userEmail });

  if (!user)
    throw new customError("That email doesn't exist", StatusCodes.UNAUTHORIZED);

  const isPasswordTrue = await user.compare(userPass);

  if (!isPasswordTrue)
    throw new customError("Wrong password", StatusCodes.UNAUTHORIZED);

  req.user = user;
  next();
};

module.exports = authentication;
