const express = require('express');
const router = express.Router();
const commentaireController = require('../controllers/commentaire.controller');

// Route pour récupérer et stocker les commentaires d'une publication Instagram
router.post('/', commentaireController.partagerCommentaire);

// Route pour mettre à jour la sélection d'un commentaire
router.put('/selection', commentaireController.updateSelectionCommentaire);

// Route pour récupérer les commentaires sélectionnés selon la plateforme
router.get('/partager', commentaireController.getCommentairesSelectionnes);

module.exports = router;
