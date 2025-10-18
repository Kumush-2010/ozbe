const Order = require('../models/orders');

exports.checkoutPage = async (req, res) => {
  try {
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    res.render('checkout', {
      cart,
      total,
      layout: false,
      user: req.session.user || { name: 'Foydalanuvchi', phone: '+998' }
    });
  } catch (error) {
    console.error('Checkout sahifasini yuklashda xatolik:', error);
    res.status(500).send('Serverda xatolik yuz berdi.');
  }
};

// exports.checkout = async (req, res) => {
//   try {
//     const cart = req.session.cart || [];
//     const total = cart.reduce((sum, item) => sum + item.price, 0);

//     const user = req.session.user;
//     if (!user) return res.redirect('/login');

//     const newOrder = new Order({
//       userId: user._id,
//       fullName: req.body.fullName,
//       phone: req.body.phone,
//       address: req.body.address,
//       delivery: req.body.delivery,
//       payment: req.body.payment,
//       items: cart,
//       total,
//     });

//     await newOrder.save();

//     req.session.cart = [];
//     res.redirect('/profile/orders');
//   } catch (error) {
//     console.error('Buyurtma berishda xatolik:', error);
//     res.status(500).send('Serverda xatolik yuz berdi.');
//   }
// };


exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const {address } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Savat bo‘sh.' });
    }

    const orderItems = cart.items.map(item => ({
      productId: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      address
    });

    await order.save();

    cart.items = [];
    await cart.save();

    return res.status(201).json({
      success: true,
      message: 'Buyurtma muvaffaqiyatli yaratildi.',
      order,
    });
  } catch (error) {
    console.error('Buyurtma yaratishda xatolik:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi.',
      error: error.message,
    });
  }
}