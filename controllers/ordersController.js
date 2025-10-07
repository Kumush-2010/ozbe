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

exports.checkout = async (req, res) => {
  try {
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const user = req.session.user;
    if (!user) return res.redirect('/loginn');

    const newOrder = new Order({
      userId: user._id,
      fullName: req.body.fullName,
      phone: req.body.phone,
      address: req.body.address,
      delivery: req.body.delivery,
      payment: req.body.payment,
      items: cart,
      total,
    });

    await newOrder.save();

    req.session.cart = [];
    res.redirect('/profile/orders');
  } catch (error) {
    console.error('Buyurtma berishda xatolik:', error);
    res.status(500).send('Serverda xatolik yuz berdi.');
  }
};
