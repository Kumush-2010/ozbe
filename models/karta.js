const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const cardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  cardHolder: { type: String },
  cardNumber: { type: Number },
  expiry: { type: String },
  cvv: { type: Number }
})

module.exports = mongoose.model('Card', cardSchema);