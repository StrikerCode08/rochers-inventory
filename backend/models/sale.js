// Sale Schema (models/Sale.js)
const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  saleDate: {
    type: Date,
    default: Date.now,
  },
  totalSellingAmount: {
    type: Number,
    required: true,
  },
  totalCostAmount: {
    type: Number,
    required: true,
  },
});

const Sale = mongoose.model("Sale", saleSchema);
module.exports = Sale;
