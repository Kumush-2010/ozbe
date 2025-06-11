const User = require("../models/user");
const Card = require('../models/karta')
const { createClient } = require('@supabase/supabase-js');
require("dotenv").config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);


exports.profil = async (req, res) => {
     const userId = req.cookies.userId;
  if (!userId) {
    return res.status(401).json({ message: "ID topilmadi. Iltimos, qayta login qiling." });
  }

  try {
    const user = await User.findById(userId).select('-password').populate('card').exec();
    // console.log(user.card);
    if (!user) return res.status(404).json({ message: "User topilmadi" });

    return res.render('profil', {
      layout: false,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
}


exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  // console.log(req.file);
  
  try {
    if (req.file) {
      const bucketName = "images";
      // MemoryStorage’da fayl bufferdan o‘qilyapti:
      const fileBuffer = req.file.buffer;
      const fileName = `users/${Date.now()}_${req.file.originalname}`;

      // Supabase’ga yuklaymiz:
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, fileBuffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: req.file.mimetype,
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        return res.status(500).json({ message: "Rasm yuklashda xatolik yuz berdi" });
      }

      // Public URL olish:
      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      if (urlError) {
        console.error("Supabase getPublicUrl error:", urlError);
        return res.status(500).json({ message: "Rasm URL olishda xatolik yuz berdi" });
      }

      updates.image = publicUrl;
    }

    // console.log(updates);
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User topilmadi" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server xatoligi" });
  }
};


exports.card = async (req, res) => {
  try {
    const { userId, cardNumber, cardHolder, expiry, cvv } = req.body;

    const user = await User.findById(userId).populate("card");

    if (!user || !user.card) {
      return res.status(404).json({ success: false, message: "Karta topilmadi" });
    }

    // Karta maydonlarini yangilaymiz
    const card = await Card.findByIdAndUpdate(
      user.card._id,
      { cardNumber, cardHolder, expiry, cvv },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Karta ma'lumotlari yangilandi",
      data: card
    });

  } catch (error) {
    console.error("❌ Karta yangilashda xatolik:", error);
    return res.status(500).json({ success: false, message: "Server xatosi", error: error.message });
  }
};
