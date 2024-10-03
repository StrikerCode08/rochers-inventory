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
  adminAuth,
  validate([
    body("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
    body("category").isMongoId().withMessage("Invalid category ID"),
    body("subCategory").isMongoId().withMessage("Invalid subCategory ID"),
  ]),
  async (req, res) => {
    try {
      const { name, category, subCategory } = req.body;
      const product = new Product({
        name,
        category,
        subCategory,
      });

      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
    }
  }
);
//Edit Product
router.put(
  "/:id",
  adminAuth,
  validate([
    body("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
    body("category").isMongoId().withMessage("Invalid category ID"),
    body("subCategory").isMongoId().withMessage("Invalid subCategory ID"),
  ]),
  async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, category, subCategory } = req.body;

      // Find the product by ID and update it
      const product = await Product.findByIdAndUpdate(
        id,
        { name, category, subCategory },
        { new: true, runValidators: true } // `new` returns the updated document, `runValidators` applies validators
      );

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
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
      res.status(204).json({ message: "Deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  }
);

// Get Products with Pagination
router.get(
  "/",
  auth,
  validate([
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("search")
      .optional()
      .isString()
      .withMessage("Search must be a string"),
  ]),
  async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100); // Cap limit to 100
    const skip = (page - 1) * limit;

    // Prepare the search query
    const searchKeyword = req.query.search
      ? {
          $or: [
            { name: new RegExp(req.query.search, "i") },
            { "category.name": new RegExp(req.query.search, "i") },
            { "subCategory.name": new RegExp(req.query.search, "i") },
          ],
        }
      : {};
    try {
      const [products, total] = await Promise.all([
        Product.find(searchKeyword)
          .populate("category subCategory")
          .skip(skip)
          .limit(limit),
        Product.countDocuments(searchKeyword),
      ]);

      res.json({
        products: products.map((product) => ({
          ...product.toObject(),
          category: product.category?.name || null,
          subCategory: product.subCategory?.name || null,
        })),
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      });
    } catch (error) {
      console.error("Error fetching products:", error); // More specific error logging
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }
);

module.exports = router;
