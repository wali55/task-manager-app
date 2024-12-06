const jwt = require("jsonwebtoken");
const { User } = require("./db");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json("No token found");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({username: decoded?.username});
        req.userId = user?._id;
        next();
    } catch (error) {
        console.log('error', error);
        return res.status(401).json("Token is incorrect");
    }
}

module.exports = {authMiddleware};