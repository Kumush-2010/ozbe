const Order = require('../models/orders');
const { cart } = require('./pagesController');

exports.checkoutPage = (req, res) => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    res.render('checkout', { cart, total });
}

exports.checkout = async (req, res) => {
    try {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        const newOrder = new Order({
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            delivery: req.body.delivery,
            payment: req.body.payment,
            items: cart,
            total,
        });

        await newOrder.save();
        res.send('Buyurtma muvaffaqiyatli qabul qilindi!');
    } catch (error) {
        console.error('Buyurtma berishda xatolik:', error);
        res.status(500).send('Serverda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko‘ring.');
    }   
};


