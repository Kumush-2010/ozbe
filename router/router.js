
const router = require('express').Router();
const { login, loginPage, registerPage, register } = require("../controllers/authController");
const { profilPage, profil, updateProfile, card, cardPage } = require('../controllers/profilController');
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
.get(
    '/register',
    registerPage
)
.post(
    '/register',
    register
)
// .get(
//     '/profil',
//     profilPage
// )
.get(
    '/profil',
    profil
)
.post(
    '/profil/:id',
    upload.single('image'),
    updateProfile
)
.get(
    '/card',
    cardPage
)
.post(
    '/card',
    card
)

module.exports = router