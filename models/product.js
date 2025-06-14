const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      enum: ["oq", "qora", "ko'k", "pushti", "qizil", "sariq"]
    },
    size: {
      type: String,
      enum: ["XXL", "L", "S", "M", "XL", "XXXL", "6XL", "4XL", "XS", "8XL", "XXS", "5XL", "7XL", "XXXS", "42", "40", "L/XL", "S/M", "Freesize", "Ovesize"]
    },
    images: [String],
    price: {
      type: Number,
    },
    countInStock: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
