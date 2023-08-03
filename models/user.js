const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

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

async function hashPass(pass) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pass, salt);
}

userSchema.pre("save", async function () {
  this.password = await hashPass(this.password);
});

userSchema.post("findOneAndUpdate", async function (doc, next) {
  const updated = this.getUpdate();
  if (updated["$set"] && updated["$set"].password) {
    const { password } = doc;
    doc.password = password;
    await doc.save(); // will call .pre("save") middleware
  }
  next();
});

userSchema.methods.compare = async function (userPass) {
  const isMatch = await bcrypt.compare(userPass, this.password);
  return isMatch;
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
