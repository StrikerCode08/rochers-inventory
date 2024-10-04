const express = require("express");
const { body, param, query, validationResult } = require("express-validator");
const Sale = require("../models/sale");
const Product = require("../models/product");
const User = require("../models/user");
const { auth, adminAuth } = require("../middleware/auth");
const { ObjectId } = require("mongodb");

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

// Add Sale
router.post(
  "/",
  auth,
  validate([
    body("product").isMongoId().withMessage("Valid product ID is required."),
    body("buyer").isMongoId().withMessage("Valid buyer ID is required."),
    body("quantity")
      .isInt({ gt: 0 })
      .withMessage("Quantity must be a positive integer."),
    body("broughtFor").isNumeric().withMessage("Brought For must be a number."),
    body("soldFor").isNumeric().withMessage("Sold For must be a number."),
  ]),
  async (req, res) => {
    try {
      const { products, buyer } = req.body;
      const existingProducts = await Product.find({
        _id: {
          $in: [products.map((item) => ObjectId.createFromHexString(item.id))],
        },
      });
      const existingBuyer = await User.findById(buyer);

      if (!existingProduct)
        return res.status(404).json({ message: "Product not found." });
      if (!existingBuyer)
        return res.status(404).json({ message: "Buyer not found." });
      let totalSellingAmount = 0;
      let totalPurchaseAmount = 0;
      const payLoad = [];
      products.forEach((item) => {
        const existingProduct = existingProducts.find(
          (prod) => prod._id === item.id
        );

        if (existingProduct) {
          const productTotal = existingProduct.sellingPrice * item.quantity;
          const productTotalPurchase =
            existingProduct.costPrice * item.quantity;
          payLoad.push({
            ...item,
            productTotal,
          });

          totalSellingAmount += productTotal;
          totalPurchaseAmount += productTotalPurchase;
        } else {
          console.log(
            `Product with ID ${item.id} not found in existing products.`
          );
        }
      });
      const sale = new Sale({
        payLoad,
        buyer,
        totalSellingAmount,
        totalPurchaseAmount,
      });

      await sale.save();
      res.status(201).json(sale);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create sale" });
    }
  }
);

// Delete Sale
router.delete(
  "/:id",
  adminAuth,
  validate([param("id").isMongoId().withMessage("Invalid sale ID")]),
  async (req, res) => {
    try {
      const sale = await Sale.findByIdAndDelete(req.params.id);
      if (!sale) {
        return res.status(404).json({ error: "Sale not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete sale" });
    }
  }
);

// Get Sales with Pagination
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
  ]),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const sales = await Sale.find()
        .populate("product buyer")
        .skip(skip)
        .limit(limit);

      const total = await Sale.countDocuments();

      res.json({
        sales,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalSales: total,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch sales" });
    }
  }
);

// Edit Sale
router.put(
  "/:id",
  auth,
  validate([
    param("id").isMongoId().withMessage("Invalid sale ID"),
    body("product").isMongoId().withMessage("Valid product ID is required."),
    body("buyer").isMongoId().withMessage("Valid buyer ID is required."),
    body("quantity")
      .isInt({ gt: 0 })
      .withMessage("Quantity must be a positive integer."),
    body("broughtFor").isNumeric().withMessage("Brought For must be a number."),
    body("soldFor").isNumeric().withMessage("Sold For must be a number."),
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { product, buyer, quantity, broughtFor, soldFor } = req.body;

      const sale = await Sale.findById(id);
      if (!sale) return res.status(404).json({ message: "Sale not found." });

      const existingProduct = await Product.findById(product);
      const existingBuyer = await User.findById(buyer);

      if (!existingProduct)
        return res.status(404).json({ message: "Product not found." });
      if (!existingBuyer)
        return res.status(404).json({ message: "Buyer not found." });

      const totalAmount = soldFor * quantity;

      sale.product = product;
      sale.buyer = buyer;
      sale.quantity = quantity;
      sale.totalAmount = totalAmount;
      sale.broughtFor = broughtFor;
      sale.soldFor = soldFor;

      await sale.save();
      res.json(sale);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update sale" });
    }
  }
);

module.exports = router;
