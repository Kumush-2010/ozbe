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
    console.log("🟡 [removeCart] Body:", req.body);
    console.log("🟡 [removeCart] User:", req.user);

    // JSON parser ishlamayotganini aniqlash uchun log
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "So‘rovda body yo‘q (req.body undefined)",
      });
    }

    const userId = req.user?.id;
    const cartId = req.user?.cartId;
    const { productId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Foydalanuvchi aniqlanmadi (req.user yo‘q)",
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Mahsulot ID yuborilmagan (productId yo‘q)",
      });
    }

    // Savatni topamiz
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Savat topilmadi",
      });
    }

    // Savatdan mahsulotni topamiz
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Mahsulot savatda topilmadi",
      });
    }

    // Quantity kamaytirish yoki o‘chirish
    if (cart.items[existingItemIndex].quantity > 1) {
      cart.items[existingItemIndex].quantity -= 1;
    } else {
      cart.items.splice(existingItemIndex, 1);
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Mahsulot savatdan olib tashlandi",
      cart,
    });
  } catch (err) {
    console.error("🔴 [removeCart] Xatolik:", err);
    return res.status(500).json({
      success: false,
      message: "Server xatosi",
      error: err.message,
    });
  }
};


