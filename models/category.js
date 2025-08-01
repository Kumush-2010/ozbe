const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
  },
  image: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
