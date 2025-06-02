const express = require('express');
const router = express.Router();
const publicationController = require('../controllers/publication.controller');

// 🔄 Publication multiple d'un voyage
router.post('/:id/publier-multi', publicationController.publierMulti);

// 🔄 Publication multiple d'une Omra
router.post('/:id/publier-multiOmra', publicationController.publierMultiOmra);

// 📥 Récupérer toutes les publications
router.get('/', publicationController.getAll);

// 📥 Récupérer une publication par ID
router.get('/:id', publicationController.getById);

// 📥 Récupérer les publications liées à un voyage publié
router.get('/voyages/:id/publications', publicationController.getPublicationsByVoyageId);

// 📥 Récupérer les publications liées à une Omra publiée
router.get('/omras/:id/publications', publicationController.getPublicationsByOmraId);

// ❤️ Récupérer les likes d'une publication (avec cache)
router.get('/publication/likes', publicationController.getLikesByPostId);

module.exports = router;
