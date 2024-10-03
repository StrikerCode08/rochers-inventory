const express = require("express");
const { Category, SubCategory } = require("../models/category");
const { auth, adminAuth } = require("../middleware/auth");
const { body, param, validationResult } = require("express-validator");
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

    try {
      await category.save();
      res.status(201).json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create category" });
    }
  }
);

// Edit Category
router.put(
  "/:id",
  adminAuth,
  [
    param("id").isMongoId().withMessage("Invalid category ID"),
    body("name").notEmpty().withMessage("Category name is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).send("Category not found");
      }

      category.name = name;
      await category.save();
      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update category" });
    }
  }
);

// Delete Category
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).send("Category not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// Get Categories with Pagination
router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
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

    try {
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found." });
      }

      const subCategory = new SubCategory({ name, category });
      await subCategory.save();
      res.status(201).json(subCategory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create subcategory" });
    }
  }
);

// Edit SubCategory
router.put(
  "/subcategories/:id",
  adminAuth,
  [
    param("id").isMongoId().withMessage("Invalid subcategory ID"),
    body("name").notEmpty().withMessage("Subcategory name is required"),
    body("category").notEmpty().withMessage("Category ID is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, category } = req.body;

    try {
      const subCategory = await SubCategory.findById(req.params.id);
      if (!subCategory) {
        return res.status(404).json({ message: "SubCategory not found." });
      }

      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found." });
      }

      subCategory.name = name;
      subCategory.category = category;

      await subCategory.save();
      res.json(subCategory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update subcategory" });
    }
  }
);

// Delete SubCategory
router.delete("/subcategories/:id", adminAuth, async (req, res) => {
  try {
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!subCategory) {
      return res.status(404).send("Subcategory not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete subcategory" });
  }
});

// Get SubCategories by Category with Pagination and Populate
router.get("/subcategories/:categoryId", auth, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const subCategories = await SubCategory.find({
      category: req.params.categoryId,
    })
      .populate("category") // Populate category details
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch subcategories" });
  }
});

module.exports = router;
