const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/user");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/category"); // Ensure you have the right path
const saleRoutes = require("./routes/sale"); // Ensure you have the right path
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const User = require("./models/user"); // Ensure the model is correct and exported
const product = require("./models/product");
const Sale = require("./models/sale");
const { Category, SubCategory } = require("./models/category");

dotenv.config();
connectDB();

const loadAdminJS = async () => {
  try {
    const { default: AdminJS } = await import("adminjs");
    const { buildRouter } = await import("@adminjs/express");
    const AdminJSMongoose = await import("@adminjs/mongoose");

    const app = express();
    const allowedOrigins = [
      "http://localhost:5173", // Example origin
      "https://rochersadmin.strikercode.tech", // Add your production origin
      "https://rochers-inventory.pages.dev",
    ];

    AdminJS.registerAdapter(AdminJSMongoose);

    const admin = new AdminJS({
      resources: [
        {
          resource: User,
          options: {
            // Optional: Configure how the resource behaves in AdminJS
            listProperties: ["name", "username", "role"],
            editProperties: ["name", "username", "role"],
            filterProperties: ["name"],
          },
        },
        {
          resource: product,
        },
        {
          resource: Sale,
        },
        {
          resource: Category,
        },
        {
          resource: SubCategory,
        },
      ],
      rootPath: "/admin",
    });

    const adminRouter = buildRouter(admin);
    app.use(admin.options.rootPath, adminRouter);
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
    app.use("/api/sales", saleRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to load AdminJS modules:", err);
  }
};

loadAdminJS();
