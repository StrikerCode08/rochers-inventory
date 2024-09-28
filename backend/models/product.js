const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  broughtFor: { type: Number, required: true },
  soldFor: { type: Number, required: true },
});

module.exports = mongoose.model("Product", ProductSchema);
