const jwt = require("jsonwebtoken");
require("dotenv/config");

function auth(req, res, next) {
    const token = req.headers["x-auth-token"];

    // Check for token
    if (!token) {
        res.status(401).json({ msg: "No token, authorization denied" });
    } else {
        try {
            const decoded = jwt.verify(token, process.env.jwtSecret);

            // Add user from payload to req
            req.user = decoded;
            next();
        } catch (error) {
            res.status(400).json({ msg: "Token is not valid", error });
        }
    }
}

module.exports = auth;
