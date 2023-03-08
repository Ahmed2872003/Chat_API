const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const Cryptr = require("cryptr");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Must provide a name"],
    minlength: [1, "name must be between 1 to 20 characters"],
    maxlength: [20, "name must be between 1 to 20 characters"],
  },
  email: {
    type: String,
    required: [true, "Must provide an email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Must provide a password"],
    minlength: [6, "password mustn't be shorter than 6 characters"],
  },
  active: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", function () {
  const cryptr = new Cryptr(process.env.CRYPTER_SECRET);
  this.password = cryptr.encrypt(this.password);
});

userSchema.methods.compare = function (userPass) {
  const cryptr = new Cryptr(process.env.CRYPTER_SECRET);
  return cryptr.decrypt(this.password) === userPass ? true : false;
};

userSchema.methods.createJWT = function () {
  const token = jwt.sign(
    { userID: this._id.toString(), username: this.name },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
  return token;
};

module.exports = mongoose.model("user", userSchema);
