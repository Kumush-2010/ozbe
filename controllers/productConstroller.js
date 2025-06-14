const Product = require('../models/product');
const Category = require('../models/category');
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// GET /api/products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category')
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Xatolik' });
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: 'Topilmadi' });
    res.json(product);
  } catch {
    res.status(500).json({ message: 'Xatolik' });
  }
};
// Qidiruv
exports.getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;

    const query = {};

    // 🔍 Nomi bo‘yicha qidiruv
    if (search) {
      query.name = { $regex: search, $options: 'i' }; // 'i' = case-insensitive
    }

    // 📂 Kategoriya bo‘yicha filter
    if (category) {
      query.category = category;
    }

    // 💸 Narx oralig‘i
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // 🧾 Saralash
    let sortOption = {};
    if (sort === 'price_asc') sortOption.price = 1;
    else if (sort === 'price_desc') sortOption.price = -1;
    else if (sort === 'newest') sortOption.createdAt = -1;

    // 📄 Pagination
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};