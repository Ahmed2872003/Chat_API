const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connectDB = (mongo_uri) => {
  return mongoose.connect(mongo_uri);
};

module.exports = connectDB;
