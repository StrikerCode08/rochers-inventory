// Sale Schema (models/Sale.js)
const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  saleDate: { type: Date, default: Date.now },
  quantity: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  broughtFor: { type: Number, required: true }, // New field
  soldFor: { type: Number, required: true }, // New field
});

const Sale = mongoose.model("Sale", saleSchema);
module.exports = Sale;
