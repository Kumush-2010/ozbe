const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendSMS = require("../utils/eskiz");
const Cart = require("../models/cart");
const codes = new Map();

function generateCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}


exports.registerPage = (req, res) => {
  return res.render("register", { layout: false });
};

// Bitta endpoint: ro'yxatdan o'tish yoki tasdiqlash
exports.register = async (req, res) => {
  const { name = "", phone, password: rawPassword, code } = req.body;
  const password = typeof rawPassword === "string" ? rawPassword.trim() : "";

  if (!phone) return res.status(400).json({ error: "Telefon raqam kiritilmagan." });

  // 1. Agar kod yuborilmagan bo‘lsa — bu register bosqichi
  if (!code) {
    if (!password || !name.trim()) {
      return res.status(400).json({ error: "Ism va parol talab qilinadi." });
    }

    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({ error: "Bu raqam allaqachon ro‘yxatdan o‘tgan" });
    }

    const verificationCode = generateCode();
    codes.set(phone, {
      name: name.trim(),
      password,
      code: verificationCode,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 daqiqa
    });

    await sendSMS(phone, verificationCode);
    return res.json({ message: "Kod yuborildi" });
  }

  // 2. Aks holda bu verify bosqichi
  const saved = codes.get(phone);
  if (!saved || saved.code !== code || Date.now() > saved.expiresAt) {
    return res.status(400).json({ error: "Kod noto‘g‘ri yoki eskirgan" });
  }

  codes.delete(phone);

  const hashedPassword = await bcrypt.hash(saved.password.trim(), 10);
  const user = await User.create({
    name: saved.name,
    phone,
    password: hashedPassword,
  });

  const cart = await Cart.create({
    user: user._id,
    product: [],
    quantity: 0
  })
  user.cart = cart._id;
  await user.save();

  const token = jwt.sign(
    { id: user._id, phone: user.phone, role: user.role, cartId: cart._id },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );

  res.cookie("token", token, { httpOnly: true, maxAge: 2 * 24 * 60 * 60 * 1000 });
  res.cookie("userId", user._id.toString(), {
    httpOnly: false,
    maxAge: 2 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.json({ message: "Ro‘yxatdan o‘tildi", token });
};


// JWT token yaratish
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      phone: user.phone, 
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );
};

exports.loginPage = (req, res) => {
  if (req.user) {
    return res.redirect("/profil");
  }
  return res.render("login", { layout: false });
};

exports.login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ error: "Foydalanuvchi topilmadi." });
    }

    if (!password) {
      return res.status(400).json({ error: "Parol kiritilmagan." });
    }

    const isMatch =  bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Parol noto'g'ri." });
    } 

    const token = jwt.sign(
      { id: user._id, role: user.role, cartId: user.cart},
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict", 
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("userId", user._id.toString(), {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      message: "Muvaffaqiyatli kirdingiz",
      token,
      user,
    });

    // AGAR redirect qilish kerak bo‘lsa: return res.redirect('/profil');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Serverda xatolik yuz berdi." });
  }
};



exports.checkAuth = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ loggedIn: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ loggedIn: true, user: decoded });
  } catch (err) {
    return res.json({ loggedIn: false });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  // res.status(200).json({ message: "Chiqdingiz!" });
  return res.redirect("/api/auth/login");
};
