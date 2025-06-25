
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
    // 1) Sessiyadagi userId ni log qilib ko‘ramiz
    // console.log(' req.headers.cookie:', req.headers.cookie);
    // console.log('🟢 [addCart] req.sessionID:', req.sessionID);
    // console.log('🟢 [addCart] req.session:', req.session);

    const userId = req.userId;
    const { productId } = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Foydalanuvchi aniqlanmadi" });
    }
    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Mahsulot ID yo‘q" });
    }

    let item = await Cart.findOne({ user: userId, product: productId });
    if (item) {
      item.quantity += 1;
      await item.save();
      return res.json({ success: true, message: "Savat yangilandi", item });
    }

    item = new Cart({ user: userId, product: productId, quantity: 1 });
    await item.save();
    await item.populate('product', 'name price images');
    // console.log('🟢 [addCart] Yangi item yaratildi:', item);
    res.status(201).json({ success: true, message: 'Savatga qo‘shildi', item });
  } catch (err) {
    console.error('🔴 [addCart] Xatolik:', err);
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
};