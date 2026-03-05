const express = require("express");
const router = express.Router();

const { register, token } = require("../controllers/auth.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/token", token);

// endpoint de prueba (protegido)
router.get("/me", authenticateToken, (req, res) => {
    res.json({ message: "OK ✅", user: req.user });
});

module.exports = router;