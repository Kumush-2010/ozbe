const express = require("express");
const router = express.Router()
const wishlist = require("../models/wishlist");
const mongoose = require('mongoose');

exports.getWishlist = async (req, res) => {
 const userId = req.user?.id;
  console.log("Foydalanuvchi ID:", userId);
  if (!userId) {
    return res.status(401).json({ success: false, message: "Foydalanuvchi aniqlanmadi" });
  }

  try {
    const items = await wishlist
      .find({ userId })
      .populate('productId') // mahsulot haqida to‘liq ma’lumot

      console.log(items)
    res.render('wishlist', {
        title: 'Wishlarim',
        wishlist: items
    })
  } catch (error) {
    console.error("Wishlistni olishda xatolik:", error);
    res.status(500).json({ success: false });
  }
};



exports.addWishlist = async (req, res) => {
  console.log("req.body:", req.body);

  const { productId } = req.body;
  console.log("Kelgan productId:", productId);

  if (!productId || productId === "undefined") {
    return res.status(400).json({ message: "productId noto‘g‘ri" });
  }

  const userId = req.user?.id;
  console.log("Foydalanuvchi ID:", userId);

  if (!userId) {
    return res.status(401).json({ message: "Foydalanuvchi aniqlanmadi" });
  }

  try {
    const exists = await wishlist.findOne({ userId, productId });

    if (!exists) {
      const created = await wishlist.create({ userId, productId }); // ⚠️ muhim
      console.log("Wishlistga qo‘shildi:", created);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({ success: false });
  }
};


exports.removeWishlist = async (req, res) => {
    const { productId } = req.body
    const userId = req.session.userId

    try {
        await wishlist.deleteOne({ userId, productId })
        res.json({ success: true })
    } catch (error) {
        console.error(error)
        res.json({ success: false})
    }
}

