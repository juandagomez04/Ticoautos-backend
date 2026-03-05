const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

// POST /auth/register
async function register(req, res) {
  try {
    const { name, lastName, email, password } = req.body;

    if (!name || !lastName || !email || !password) {
      return res.status(400).json({ message: "Faltan datos: name, lastName, email, password." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener mínimo 6 caracteres." });
    }

    const cleanEmail = email.toLowerCase().trim();

    const exists = await User.exists({ email: cleanEmail });
    if (exists) return res.status(409).json({ message: "Ese email ya está registrado." });

    const passwordHash = await bcrypt.hash(password, 10);

    const created = await User.create({
      name: name.trim(),
      lastName: lastName.trim(),
      email: cleanEmail,
      passwordHash,
    });

    return res.status(201).json({
      _id: created._id,
      name: created.name,
      lastName: created.lastName,
      email: created.email,
      createdAt: created.createdAt,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

// POST /auth/token  (login)
async function token(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Email y password son requeridos." });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: "Credenciales inválidas." });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas." });

    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({ token: jwtToken });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

module.exports = { register, token };