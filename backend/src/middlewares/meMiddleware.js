// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/jwt.config');

const authenticateTokenn = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: "Token non fourni" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;  // Ajoute l'utilisateur décodé au `req.user`
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token invalide" });
  }
};

module.exports = authenticateTokenn;
