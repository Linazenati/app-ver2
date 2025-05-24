const express = require('express');
const router = express.Router();
const amadeusController = require('../controllers/amadeus.controller');

router.post('/vols/search', amadeusController.rechercherVols);

module.exports = router;
