const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/user");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/category"); // Ensure you have the right path
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173", // Example origin
  "https://rochersadmin.strikercode.tech", // Add your production origin
  "https://rochers-inventory.pages.dev",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
