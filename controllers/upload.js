const { StatusCodes } = require("http-status-codes");

const cloudinary = require("../util/cloudinary");

const User = require("../models/user");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

// errors
const customErr = require("../errors/customError");

const uploadImg = async (req, res, next) => {
  if (!req.file)
    throw new customErr("Must provide an image", StatusCodes.BAD_REQUEST);

  const user = await User.findById(req.user.userID);

  let oldPublicID = user.get("public_ID");

  const { secure_url, public_id } = await cloudinary.upload_buffer(
    req.file.buffer,
    oldPublicID
  );

  if (!oldPublicID) {
    user.public_ID = public_id;
    await user.save();
  }

  res.status(200).json({ secure_url, public_id });
};

module.exports = { uploadImg };
