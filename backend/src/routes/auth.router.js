// src/routes/utilisateur.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const authenticateTokenn = require("../middlewares/meMiddleware");
// GET /utilisateurs
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.post('/register', controller.register);
router.get('/me',authenticateTokenn,controller.currentUser);

module.exports = router;
