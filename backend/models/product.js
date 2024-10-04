const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
  sellingPrice: { type: Number, required: true },
  costPrice: { type: Number, required: true },
});

module.exports = mongoose.model("Product", ProductSchema);
