const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization; // "Bearer xxx"
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Token requerido." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, email, iat, exp }
        next();
    } catch (e) {
        return res.status(401).json({ message: "Token inválido o expirado." });
    }
}

module.exports = { authenticateToken };