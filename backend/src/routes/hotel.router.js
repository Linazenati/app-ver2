// src/routes/utilisateur.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/hotel.controller');



// GET /villes
router.get('/ville/:region', controller.getAllVilles);


///recuperer le hotels par ville
router.get('/par-ville/:villeId', controller.getHotelsByVilleId);


// Route pour rechercher et sauvegarder les hôtels via Booking
router.get('/search-and-save-hotels', controller.searchAndSaveHotelsForVille);

router.get('/by-id/:villeId', controller.getVilleById);


//recuperer hotel  by id
router.get('/:idhotel', controller.getHotelById);

// POST /api/v1/ville
router.post('/ville', controller.create);



// GET /api/v1/villes?search=&region=&limit=&offset=&orderBy=&orderDir=
router.get('/', controller.getAll);

// DELETE /api/v1/villes/:id
router.delete('/:id', controller.remove);

module.exports = router;
