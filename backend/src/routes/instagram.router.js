const express = require("express");
const router = express.Router();
const instagramController = require("../controllers/instagram.controller");


//✏️ publier un voyage sur fb  par ID
router.post("/:id/publier", instagramController.publierSurInstagram);
// recuperer tous les publications 
router.get('/publications', instagramController.getAllInstagramPublications);

// recuperer tous les commentaires d'une pub
router.get('/:instagram_post_id/commentaires',instagramController.recupererCommentairesPublication)

// 🔔 Récupérer le nombre actuel de notifications (nouveaux commentaires détectés)
router.get('/notifications/count', instagramController.getNotificationsCount);

// 🔔 Réinitialiser le compteur de notifications à zéro (par exemple quand l'utilisateur a vu les nouveaux commentaires)
router.post('/notifications/reset', instagramController.resetNotificationsCount); // si tu veux remettre à 0


// ✅ Supprimer un commentaire
router.delete('/commentaires/:commentId', instagramController.supprimerCommentairePublication);



// ✅ Masquer un commentaire
router.post('/commentaires/:commentId/masquer', instagramController.masquerCommentairePublication);

// recuperer tous les likes d'une pub
router.get('/:instagram_post_id/likes',instagramController.recupererLikesPublication)


module.exports = router;
