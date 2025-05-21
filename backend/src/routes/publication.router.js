const express = require('express');
const router = express.Router();
const publicationController = require('../controllers/publication.controller');


router.post('/:id/publier-multi', publicationController.publierMulti);

router.get('/', publicationController.getAll);
router.get('/:id', publicationController.getById);

// ✅ Récupérer les publications d'un voyage publié par ID
router.get('/voyages/:id/publications', publicationController.getPublicationsByVoyageId);

module.exports = router;
