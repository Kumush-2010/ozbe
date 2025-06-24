const cart = require("../models/cart");

exports.addCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Foydalanuvchi aniqlanmadi" });
    }

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Mahsulot ID yo'q" });
    }

    const existing = await cart.findOne({ user: userId, product: productId });
    if (existing) {
      existing.quantity += 1;
      await existing.save();
      return res.json({ success: true, message: "Savatga yangilandi" });
    }

    const newCartItem = new cart({
      user: userId,
      product: productId,
      quantity: 1,
    });
    await newCartItem.save();
    res.json({ success: true, message: "Savatga qo'shildi" });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({ success: false, message: "Server xatoligi:" });
  }
};
