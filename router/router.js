
const router = require('express').Router();
const { login, loginPage, registerPage, register, checkAuth } = require("../controllers/authController");
const { home, shop } = require('../controllers/pagesController');
const { profilPage, profil, updateProfile, card, cardPage } = require('../controllers/profilController');
const { getAllProducts } = require('../controllers/productConstroller')
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router
.get(
    '/login',
    loginPage
)
.post(
    '/login',
    login
)
// 👇 Bu biz qo‘shgan yangi route:
.get('/check-auth', checkAuth)
.get(
    '/register',
    registerPage
)
.post(
    '/register',
    register
)
.get(
    '/profil',
    profil
)
.post(
    '/profil/:id',
    upload.single('image'),
    updateProfile
)
.post(
    '/card',
    card
)
.get(
    '/home',
    home
)
.get(
    '/shop',
    shop
)
.get(
    '/products',
    getAllProducts
)


module.exports = router