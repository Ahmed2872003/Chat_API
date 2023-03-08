const User = require("../models/user");

const { StatusCodes } = require("http-status-codes");

const CustomAPIError = require("../errors/customError");

const jwt = require("jsonwebtoken");

// Bearer token
const authorization = async (req, res, next) => {
  const { authorization: auth } = req.headers;

  if (!auth || !auth.startsWith("Bearer "))
    throw new CustomAPIError(
      "You are not allowed to access that resource",
      StatusCodes.UNAUTHORIZED
    );

  try {
    const payload = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);

    req.user = {
      userID: payload.userID,
      username: payload.username,
    };
  } catch (err) {
    throw new CustomAPIError(
      "You are not allowed to access that resource",
      StatusCodes.UNAUTHORIZED
    );
  }

  next();
};

module.exports = authorization;
