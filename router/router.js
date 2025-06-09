
const router = require('express').Router();
const { login, loginPage, registerPage, register } = require("../controllers/authController")

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


module.exports = router