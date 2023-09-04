const streamifier = require("streamifier");

const cloudinary = require("cloudinary").v2;

cloudinary.upload_buffer = (buffer, oldPublicID) => {
  return new Promise((res, rej) => {
    if (oldPublicID) oldPublicID = oldPublicID.split("/")[1];

    const cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: "account_images",
        public_id: oldPublicID,
      },
      (err, result) => {
        if (err) {
          rej(new Error(err.message));
          return;
        }
        res(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(cld_upload_stream);
  });
};

module.exports = cloudinary;
