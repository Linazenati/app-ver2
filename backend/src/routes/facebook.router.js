const express = require("express");
const router = express.Router();
const facebookController = require("../controllers/facebook.controller");


//✏️ publier un voyage sur fb  par ID
router.post("/:id/publier", facebookController.publierSurFacebookSeule);

// recuperer tous les publications 
router.get('/publications', facebookController.getAllPublications);

// recuperer tous les commentaires d'une pub
router.get('/:id_post_facebook/commentaires',facebookController.recupererCommentairesPublication)

// 🔔 Récupérer le nombre actuel de notifications (nouveaux commentaires détectés)
router.get('/notifications/count', facebookController.getNotificationsCount);

// 🔔 Réinitialiser le compteur de notifications à zéro (par exemple quand l'utilisateur a vu les nouveaux commentaires)
router.post('/notifications/reset', facebookController.resetNotificationsCount); // si tu veux remettre à 0

// recuperer tous les likes d'une pub
router.get('/:id_post_facebook/likes',facebookController.recupererLikesPublication)


// ✅ Supprimer un commentaire
router.delete('/commentaires/:commentId', facebookController.supprimerCommentairePublication);

// ✅ Masquer un commentaire
router.post('/commentaires/:commentId/masquer', facebookController.masquerCommentairePublication);

module.exports = router;
