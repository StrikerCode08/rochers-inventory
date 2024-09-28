const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies

  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(verified._id);
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};

const adminAuth = async (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies

  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(verified._id);
    if (!verified.role === "admin") {
      res.status(401).send("Unathorized");
    }
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};

module.exports = { auth, adminAuth };
