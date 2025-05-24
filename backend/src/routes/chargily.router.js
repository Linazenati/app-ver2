const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/chargily.controller');

router.post('/initier', paiementController.initiatePayment);

module.exports = router;
