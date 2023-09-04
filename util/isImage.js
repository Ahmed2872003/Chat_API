const path = require("path");
const customError = require("../errors/customError");
const { StatusCodes } = require("http-status-codes");

const isImage = (file, cb) => {
  const imgTypesRegexp = /(JPEG|JPG|PNG)/i;
  const errMsg = "Only images required";

  if (
    !(
      imgTypesRegexp.test(path.extname(file.originalname)) &&
      imgTypesRegexp.test(file.mimetype)
    )
  ) {
    cb(new customError(errMsg, StatusCodes.BAD_REQUEST), false);
    return false;
  } else {
    cb(null, true);
    return true;
  }
};

module.exports = isImage;
