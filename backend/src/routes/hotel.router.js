// src/routes/utilisateur.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/hotel.controller');

router.get('/', controller.rechercher);

 //enregistrer tous les hotels
router.post("/Enregistrer", controller.saveAllHotels);

router.get('/Recupererhotels/:ville', controller.recupererHotelByVille);

// Route pour récupérer les villes selon une région
router.get('/villes/:region', controller.getVillesByRegion);


router.get('/recherche-temps-reel', controller.searchRealTime);


// Route pour récupérer un hôtel par ID
router.get('/:id', controller.getHotelById);

module.exports = router;
