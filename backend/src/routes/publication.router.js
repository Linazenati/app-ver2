const express = require('express');
const router = express.Router();
const publicationController = require('../controllers/publication.controller');


router.post('/:id/publier-multi', publicationController.publierMulti);

router.post('/:id/publier-multiOmra', publicationController.  publierMultiOmra);



router.get('/', publicationController.getAll);
router.get('/:id', publicationController.getById);

// ✅ Récupérer les publications d'un voyage publié par ID
router.get('/voyages/:id/publications', publicationController.getPublicationsByVoyageId);



// ✅ Récupérer les publications d'un omra publié par ID
router.get('/omras/:id/publications', publicationController.getPublicationsByOmraId);

// ✅ Nouvelle route : Récupérer les likes d'une publication avec cache
router.get('/publication/likes', publicationController.getLikesByPostId);

module.exports = router;

