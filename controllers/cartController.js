const Cart = require("../models/cart")

exports.getCart = async (req, res) => {
  try {
    // 1) Foydalanuvchi ID sini aniqlaymiz
    const userId = req.user.id;
    
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Foydalanuvchi aniqlanmadi" });
    }

    // 2) Faqat shu userga tegishli cart elementlarini topamiz
    const items = await Cart.findOne({ user: userId })
      .populate({
        path: "items.product",
        select: "name price images" 
      });

    // 3) Agar elementlar bo'sh bo'lsa ham bo'sh massiv qaytiramiz
    return res.status(200).json({
      success: true,
      items: items.items
    });
  } catch (error) {
    console.error("Cartlarni olishda xatolik:", error);
    return res.status(500).json({ success: false, message: "Server xatosi" });
  }
};
 exports.addCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartId = req.user.cartId;
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

    // Foydalanuvchi savatini topamiz
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Savat topilmadi",
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();

    return res.status(201).json({
      success: true,
      message: existingItem
        ? "Mahsulot soni oshirildi"
        : "Mahsulot savatga qo‘shildi",
      cart,
    });
  } catch (err) {
    console.error("🔴 [addCart] Xatolik:", err);
    return res.status(500).json({
      success: false,
      message: "Server xatosi",
    });
  }
};


exports.removeCart = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Cart.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Savat topilmadi" });
    }

    res.json({ success: true, message: "Savatdan o‘chirildi" });
  } catch (error) {
    console.error("O‘chirishda xatolik:", error);
    res.status(500).json({ success: false, message: "Server xatoligi" });
  }
};
