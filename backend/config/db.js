const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

let isConnected; // Variable to hold the connection state

const connectDB = async () => {
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
