const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

exports.jwtAccessMiddleware = function (req, res, next) {
    try {

const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "Token is missing" });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = user.id;
        req.user = user;
        next();
    } catch (error) {
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
