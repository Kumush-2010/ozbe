const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  address: { type: String },
  delivery: { type: String },
  payment: { type: String },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
      name: String,
      size: String,
      qty: { type: Number, default: 1 },
      image: String 
    }
  ],
  subtotal: { type: Number, default: 0 },
  deliveryPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
