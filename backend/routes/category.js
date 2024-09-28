const express = require("express");
const { Category, SubCategory } = require("../models/category");
const { auth, adminAuth } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// Add Category
router.post(
  "/",
  adminAuth,
  body("name").notEmpty().withMessage("Category name is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const category = new Category({ name });

    await category.save();
    res.status(201).json(category);
  }
);

// Delete Category
router.delete("/:id", adminAuth, async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return res.status(404).send("Category not found");
  }
  res.status(204).send();
});

// Get Categories with Pagination
router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const categories = await Category.find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Category.countDocuments();

  res.json({
    categories,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
});

// Add SubCategory
router.post(
  "/subcategories",
  adminAuth,
  [
    body("name").notEmpty().withMessage("Subcategory name is required"),
    body("category").notEmpty().withMessage("Category ID is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, category } = req.body;
    const subCategory = new SubCategory({ name, category });

    await subCategory.save();
    res.status(201).json(subCategory);
  }
);

// Delete SubCategory
router.delete("/subcategories/:id", adminAuth, async (req, res) => {
  const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
  if (!subCategory) {
    return res.status(404).send("Subcategory not found");
  }
  res.status(204).send();
});

// Get SubCategories by Category with Pagination
router.get("/subcategories/:categoryId", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const subCategories = await SubCategory.find({
    category: req.params.categoryId,
  })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await SubCategory.countDocuments({
    category: req.params.categoryId,
  });

  res.json({
    subCategories,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
});

module.exports = router;
