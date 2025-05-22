const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/paiement.controller');
const authenticateToken = require('../middlewares/meMiddleware'); // middleware JWT si tu veux sécuriser

// Récupérer tous les paiements (Stripe + Chargily)
router.get('/', authenticateToken, paiementController.getAllPaiements);

module.exports = router;
