const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Product", 
  },
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
