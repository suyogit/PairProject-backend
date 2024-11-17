const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://asuyog042:%23Pea4321@nodejsss.2iffc.mongodb.net/PairProject"
  );
};

module.exports = { connectDB };
