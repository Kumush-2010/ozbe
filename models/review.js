const mongoose = require("mongoose");

const review = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    productId: { type: String, ref: "product", index: true },
    totalPrice: { type: Number },
    rating: { type: Number },
    comment: { type: String },
    createdAt: { type: Date }
})

module.exports = mongoose.model("review", review);


