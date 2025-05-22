// routes/stripe.route.js
const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripe.controller');

// L'endpoint pour initier le paiement Stripe
router.post('/initier', stripeController.initiatePayment);

module.exports = router;
