const customError = require("../errors/customError");

const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  const error = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Internal server error",
  };

  if (err.code === 11000) {
    const keys = Object.keys(err["keyPattern"]);
    error.statusCode = StatusCodes.CONFLICT;
    error.message = `value${keys.length > 1 ? "s" : ""} in ${keys} field${
      keys.length > 1 ? "s" : ""
    } ${keys.length > 1 ? "are" : "is"} used`;
  }
  if (err.name === "ValidationError") {
    error.statusCode = StatusCodes.BAD_REQUEST;
    error.message = err.message;
  }
  if (err.name === "CastError") {
    error.statusCode = StatusCodes.NOT_FOUND;

    error.message = `No user found with id: ${err.value}`;
  }
  res.status(error.statusCode).json({ msg: error.message });
  // res.status(error.statusCode).json({ err });
};

module.exports = errorHandler;
