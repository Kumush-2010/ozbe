const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendSMS = require('../utils/eskiz');
const codes = new Map(); 

exports.registerPage = (req, res) => {
  return res.render('register', { layout: false });
}

function generateCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

exports.register = async (req, res) => {
  const { name, phone, password } = req.body;

  const existing = await User.findOne({ phone });
  if (existing) return res.status(400).json({ error: 'Bu raqam allaqachon ro‘yxatdan o‘tgan' });

  const code = generateCode();

  codes.set(phone, {
    name,
    password,
    code,
    expiresAt: Date.now() + 5 * 60 * 1000
  });

  await sendSMS(phone, code);

  res.json({ message: 'Kod yuborildi (yoki konsolga chiqarildi)' });
};

exports.verifyCode = async (req, res) => {
  const { phone, code } = req.body;
  const saved = codes.get(phone);

  if (!saved || saved.code !== code || Date.now() > saved.expiresAt) {
    return res.status(400).json({ error: 'Kod noto‘g‘ri yoki eskirgan' });
  }

  const { name, password } = saved;
  codes.delete(phone);

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({ name, phone, password: hashedPassword });

  const token = jwt.sign({ id: user._id, phone }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ message: 'Ro‘yxatdan o‘tildi', token });
};


// JWT token yaratish
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, phone: user.phone, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );
};

exports.loginPage = (req, res) => {
    return res.render('login', { layout: false });
}

exports.login = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await User.findOne({ phone });
   if (!user) {
  return res.status(404).send("Foydalanuvchi topilmadi.");
}

if (!password || !user.password) {
  return res.status(400).send("Parol yoki xash yetishmayapti.");
}

const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
  return res.status(401).send("Parol noto'g'ri.");
}


    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 💾 Cookie-ga token va userId ni saqlaymiz:
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 kun
    });

 res.cookie("userId", user._id.toString(), {
  httpOnly: false,
  maxAge: 24 * 60 * 60 * 1000,
  path: "/"            // cookie butun domen bo‘ylab ko‘rinishi uchun
});


    // res.status(200).json({ message: "Muvaffaqiyatli kirdingiz", user });
    return res.redirect('/profil')
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverda xatolik" });
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
  return res.redirect('/api/auth/login')
};