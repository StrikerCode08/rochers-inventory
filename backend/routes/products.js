const express = require("express");
const { body, param, query, validationResult } = require("express-validator");
const Product = require("../models/product");
const { auth, adminAuth } = require("../middleware/auth");
const router = express.Router();

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

// Add Product
router.post(
  "/",
  auth,
  validate([
    body("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
    body("category").isMongoId().withMessage("Invalid category ID"),
    body("subCategory").isMongoId().withMessage("Invalid subCategory ID"),
    body("buyer").isMongoId().withMessage("Invalid buyer ID"),
    body("broughtFor")
      .isNumeric()
      .withMessage("Brought for price must be a number"),
    body("soldFor").isNumeric().withMessage("Sold for price must be a number"),
    body("quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer"),
  ]),
  async (req, res) => {
    try {
      const {
        name,
        category,
        subCategory,
        buyer,
        broughtFor,
        soldFor,
        quantity,
      } = req.body;
      const product = new Product({
        name,
        category,
        subCategory,
        buyer,
        broughtFor,
        soldFor,
        quantity,
      });

      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
    }
  }
);

// Delete Product
router.delete(
  "/:id",
  adminAuth,
  validate([param("id").isMongoId().withMessage("Invalid product ID")]),
  async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  }
);

// Get Products with Pagination
router.get(
  "/",
  validate([
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
  ]),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const products = await Product.find()
        .populate("category subCategory buyer")
        .skip(skip)
        .limit(limit);

      const total = await Product.countDocuments();

      res.json({
        products,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }
);

module.exports = router;
