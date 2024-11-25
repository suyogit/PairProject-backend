if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const MONGODB_URI = process.env.MONGODB_URI;

const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(MONGODB_URI);
};

module.exports = { connectDB };
