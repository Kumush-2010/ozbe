
const Cart = require("../models/cart");

exports.getCart = async (req, res) => {
  try {
    // 1) Foydalanuvchi ID sini aniqlaymiz
    const userId = req.userId;
    
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Foydalanuvchi aniqlanmadi" });
    }

    // 2) Faqat shu userga tegishli cart elementlarini topamiz
    const items = await Cart.find({ user: userId })
      .populate({
        path: "product",
        select: "name price images description" 
      });

    // 3) Agar elementlar bo'sh bo'lsa ham bo'sh massiv qaytiramiz
    return res.status(200).json({
      success: true,
      items
    });
  } catch (error) {
    console.error("Cartlarni olishda xatolik:", error);
    return res.status(500).json({ success: false, message: "Server xatosi" });
  }
};

exports.addCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Foydalanuvchi aniqlanmadi",
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Mahsulot ID yo‘q",
      });
    }

    // 🔍 Savatda shu foydalanuvchining shu mahsuloti bor-yo‘qligini tekshiramiz
    const existingItem = await Cart.findOne({ user: userId, product: productId });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: "❗ Bu mahsulot allaqachon savatda",
        item: existingItem
      });
    }

    // ➕ Mahsulot savatda bo'lmasa, yangi item yaratamiz
    const newItem = new Cart({
      user: userId,
      product: productId,
      quantity: 1,
    });

    await newItem.save();
    await newItem.populate("product", "name price images");

    return res.status(201).json({
      success: true,
      message: "✅ Mahsulot savatga qo‘shildi",
      item: newItem,
    });
  } catch (err) {
    console.error("🔴 [addCart] Xatolik:", err);
    return res.status(500).json({
      success: false,
      message: "Server xatosi",
    });
  }
};