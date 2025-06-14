const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
exports.registerPage = (req, res) => {
  return res.render('register', { layout: false });
}

exports.register = async (req, res) => {
  try {

  const { name, phone, password } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) return res.status(400).json({ message: 'Telefon raqam allaqachon band' });

    const user = await User.create({ name, phone, password });
    const token = generateToken(user);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role
      },
      token,
    });

    // res.status(200).json({ message: "Muvaffaqiyatli kirdingiz", user });
    return res.redirect('/user')
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverda xatolik" });
  }
}



exports.logout = (req, res) => {
  res.clearCookie("token");
  // res.status(200).json({ message: "Chiqdingiz!" });
  return res.redirect('/api/auth/login')
};