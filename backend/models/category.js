const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const SubCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

module.exports = {
  Category: mongoose.model("Category", CategorySchema),
  SubCategory: mongoose.model("SubCategory", SubCategorySchema),
};
