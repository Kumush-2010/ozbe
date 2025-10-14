const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.jwtAccessMiddleware = function (req, res, next) {
    try {

const token = req.cookies?.token;

        if (!token) {
            req.user = null;
            return next()
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);

        if (!user) {
            req.user = null;
            return next();
        }

        req.user = user;
        next();
    } catch (error) {
        req.user = null;
        next();
        console.log(error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token has expired!" });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(400).json({ message: "Invalid token!" });
        }

        return res.status(500).json({ message: "Internal server error!" });
    }
};

exports.requireLogin = function (req, res, next) {
    if (!req.user) {
        return res.redirect("/login");
    }
    next();
};