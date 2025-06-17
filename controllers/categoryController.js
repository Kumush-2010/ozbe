const Category = require('../models/category');

exports.getAllCategories = async (req, res) => {
   try {
      const categories = await Category.find();
  
      if (!categories) {
        return res.status(400).send({
          message: "categorylar topilmadi!",
        });
      } else {
        return res.status(200).json({ message: "categorylar", categories });
      }
    } catch (error) {
      console.error("categorylarni olishda xatolik:", error);
      return res.status(500).json({ error: "Server xatosi yuz berdi." });
    }
};