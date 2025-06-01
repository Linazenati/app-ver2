const express = require('express');
const router = express.Router();
const commentaireController = require('../controllers/commentaire.controller');

// Route pour récupérer et stocker les commentaires d'une publication Instagram
router.post('/', commentaireController.partagerCommentaire);

// Route pour mettre à jour la sélection d'un commentaire
router.put('/selection', commentaireController.updateSelectionCommentaire);

// Route pour récupérer les commentaires sélectionnés selon la plateforme
router.get('/partager', commentaireController.getCommentairesSelectionnes);



// Route pour récupérer les commentaires sélectionnés selon la plateforme
router.get('/facebook/:id_publication', commentaireController.getCommentairesFacebook);


// Route pour récupérer les commentaires sélectionnés selon la plateforme
router.get('/instagram/:id_publication', commentaireController.getCommentairesInstagram);



//recuperer  les noveau commentaires 
router.get('/nouveaux/:id_publication', commentaireController.getNouveauxCommentaires);


module.exports = router;
