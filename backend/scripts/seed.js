const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/user"); // Adjust the path as necessary

dotenv.config();

const seedAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Check if the admin user already exists
    const existingAdmin = await User.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists. Seed operation aborted.");
      return;
    }

    // Create a new admin user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10); // Use a strong password in production
    const adminUser = new User({
      username: process.env.ADMIN_USERNAME,
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("Admin user created successfully.");
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedAdminUser();
