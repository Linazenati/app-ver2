// routes/webhook.router.js
const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook.controller');

// Endpoint que Chargily appellera
router.post('/chargily', webhookController.handleChargilyWebhook);

module.exports = router;
