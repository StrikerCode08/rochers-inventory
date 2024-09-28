const express = require("express");
const Product = require("../models/product");
const { auth, adminAuth } = require("../middleware/auth");
const router = express.Router();

// Add Product
router.post("/", auth, async (req, res) => {
  const { name, category, subCategory, buyer, broughtFor, soldFor } = req.body;
  const product = new Product({
    name,
    category,
    subCategory,
    buyer,
    broughtFor,
    soldFor,
  });

  await product.save();
  res.status(201).json(product);
});

// Delete Product
router.delete("/:id", adminAuth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Get Products
router.get("/", async (req, res) => {
  const products = await Product.find().populate("category subCategory buyer");
  res.json(products);
});

module.exports = router;
