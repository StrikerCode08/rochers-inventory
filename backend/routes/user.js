const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { adminAuth } = require("../middleware/auth");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();

    // Create a JWT token for the newly registered user
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Set cookie with token for auto-login
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false, // Use false for local development, true for production with HTTPS
      sameSite: "lax",
    });

    // Send response with user details (optional)
    res
      .status(201)
      .json({ message: "User created and logged in successfully", user });
  } catch (error) {
    res.status(400).send("Error creating user");
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).send("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send("Invalid credentials");

  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  // Set cookie with token
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false, // Use false for local development, true for production with HTTPS
    sameSite: "lax",
  });
  res.json({ message: "Logged in successfully", user });
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).send("Logged out");
});

module.exports = router;
