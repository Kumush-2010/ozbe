const User = require("../models/user");
const Card = require('../models/karta')
const { createClient } = require('@supabase/supabase-js');
require("dotenv").config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);


exports.home = (req, res) => {
    return res.render('index', { layout: false });
}

exports.shop = (req, res) => {
    return res.render('shop', { layout: false })
}

exports.contact = (req, res) => {
    return res.render('contact', { layout: false })
}
exports.details = (req, res) =>{
    return res.render('details', { layout: false })
}

exports.wishlist = (req, res) => {
    return res.render('wishlist', { layout: false })
}

exports.cart = (req, res) => {
    return res.render('cart', {layout: false })
}