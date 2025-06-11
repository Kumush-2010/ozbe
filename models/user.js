const mongoose = require("mongoose");
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    email: { type: String, unique: true, lowercase: true, },
    password: { type: String, minlength: 8 },
    phone: { type: String,  unique: true, match: /^\+998[0-9]{9}$/, },
    address: { type: String },
    role: { type: String, enum: ["user"], default: "user" },
    lastLogin: { type: Date, default: Date.now },
    cart: { type: String },
    image: { type: String },
    birth: { type: String },
    gender: { type: String, enum: ['ayol', 'erkak'],},
    card: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },
}, { timestamps: true });

// Parolni hash qilish (register paytida)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);