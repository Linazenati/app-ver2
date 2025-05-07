const path = require('path');
const axios = require('axios');
const { PAGE_ACCESS_TOKEN, GRAPH_API_VERSION , PAGE_ID } = require('../config/facebook.config');
const publicationService = require('../services/publication.service');
const voyageService = require("../services/voyageorganise.service");

const { publishToFacebook , getPublications,recupererCommentaires,supprimerCommentaire, masquerCommentaire ,recupererLikes} = require('../services/facebook.service');

const { Voyage } = require('../models');

// ✅ Publier un voyage sur Facebook
const publierSurFacebook = async (req, res,silent = false) => {
  try {
    const { id } = req.params;

    const voyage = await Voyage.findByPk(id);
    if (!voyage) {
      console.error('Voyage non trouvé');
      return res.status(404).json({ message: "Voyage introuvable" });
    }

    console.log('Voyage récupéré :', voyage);

    // 🛑 Vérifier s’il est déjà publié
    if (voyage.facebook_post_id) {
      return res.status(400).json({ message: 'Ce voyage a déjà été publié sur Facebook.' });
    }

    // ✅ Parse le champ image (un seul tableau JSON stringifié)
    let images = [];
    try {
      if (voyage.image) {
        images = JSON.parse(voyage.image);
        console.log("Images après parsing : ", images);

        if (!Array.isArray(images)) {
          throw new Error("Les images ne sont pas dans un tableau valide");
        }
      } else {
        throw new Error("Aucune image trouvée dans le voyage");
      }
    } catch (error) {
      console.error("Erreur lors du parsing des images :", error.message);
      return res.status(400).json({ message: 'Le format des images est incorrect' });
    }

    // ✅ Génère les chemins locaux des images
    const localImagePaths = images.map(image =>
      path.join(__dirname, '..', 'public', 'images', image)
    );
    console.log('📸 Chemins des images locales :', localImagePaths);

    // ✅ Message à publier
    const message = `🌍 Nouveau voyage : ${voyage.titre}
📍 Destination : ${voyage.destination}
💰 Prix : ${voyage.prix} €
📅 Date de départ : ${voyage.date_de_depart}
📝 Description : ${voyage.description}`;

    // ✅ Publication sur Facebook
    const result = await publishToFacebook(voyage ,message, localImagePaths);
    console.log('📨 Réponse Facebook :', result);

    // ✅ Enregistrement du post_id dans la BDD
    voyage.facebook_post_id = result.post_id || result.id;
    await voyage.save();

    //insérer dans la table publication
    await publicationService.publier({
      plateforme: 'facebook',
      id_voyage: id,
      id_post_facebook:result.post_id || result.id
    });

    // Modifier voyage vers `est_Publie: true`)
    const updatedVoyage = await voyageService.updateVoyage(id, { est_publier: true });

    console.log("Voyage mis à jour : ", updatedVoyage);
    
    
  if (!silent) {
      return res.status(200).json({ message: 'Publié sur Facebook',  postId: result.post_id  });
    }

    // Si silent == true, ne réponds pas au client ici.
    return { message: 'Publié sur Facebook',  postId: result.post_id  };

  } catch (error) {
    if (!silent) {
      return res.status(500).json({ message: 'Erreur Facebook', error: error.message });
    }
    // En mode silencieux, on laisse le parent gérer l'erreur
    throw error;
  }
};


//recuperer tous les publications 
const getAllPublications = async (req, res) => {
  try {
    const publications = await getPublications();
    res.status(200).json(publications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📝 Récupérer les commentaires d'une publication

let notificationsCount = 0;
let anciensCommentairesIds = [];
const recupererCommentairesPublication = async (req, res) => {
 const { facebook_post_id } = req.params;
  const cleanPostId = facebook_post_id.trim();

  console.log('ID de la publication Facebook:', cleanPostId);

  try {
    if (!cleanPostId) {
      return res.status(400).json({ message: 'Le facebook_post_id est nécessaire pour récupérer les commentaires' });
    }

    const commentaires = await recupererCommentaires(cleanPostId);

    // 🛑 Chercher les NOUVEAUX commentaires
    const nouveauxCommentaires = commentaires.filter(commentaire => {
      return !anciensCommentairesIds.includes(commentaire.id);
    });

    // 🆕 Mettre à jour la liste connue
    anciensCommentairesIds.push(...nouveauxCommentaires.map(c => c.id));

    // Si on détecte des nouveaux commentaires
    if (nouveauxCommentaires.length > 0) {
      console.log('🔔 Nouvelle notification :', nouveauxCommentaires.length, 'nouveaux commentaires détectés');

      // ➡️ Ajouter au compteur de notifications
      notificationsCount += nouveauxCommentaires.length;
    }

    // Répondre normalement
    res.status(200).json({ commentaires, nouveauxCommentaires });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

// ➡️ Route pour récupérer le compteur de notifications
const getNotificationsCount = (req, res) => {
  try {
    res.status(200).json({ count: notificationsCount });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du compteur de notifications' });
  }
};

// ➡️ Route pour resetter le compteur (optionnel si tu veux le remettre à 0 après lecture)
const resetNotificationsCount = (req, res) => {
  try {
    notificationsCount = 0;
    res.status(200).json({ message: 'Compteur de notifications réinitialisé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la réinitialisation du compteur de notifications' });
  }
};


// 📝 Récupérer les nmbr likes d'une publication
const recupererLikesPublication = async (req, res) => {
  const { facebook_post_id } = req.params;

console.log('ID de la publication Facebook:', facebook_post_id);

try {
  
    // Récupérer les likes en fonction de facebook_post_id
    const likes = await recupererLikes(facebook_post_id);  // Appeler la fonction pour récupérer les likes
    res.status(200).json(likes);  // Retourner les likes
  } catch (error) {
    res.status(500).json({ message: error.message });  // Gestion des erreurs
  }
};





// 📝 Supprimer un commentaire
const supprimerCommentairePublication = async (req, res) => {
  const { commentId } = req.params;
  console.log('🔍 Suppression du commentaire Facebook...');
  console.log('🆔 Commentaire ID reçu :', commentId);
  try {
    const reponse = await supprimerCommentaire(commentId);
    res.status(200).json(reponse);
  } catch (error) {
    console.error('🚫 Erreur finale renvoyée au client :', error.message);
    res.status(500).json({ message: error.message });
  }
};

// 📝 Masquer un commentaire
const masquerCommentairePublication = async (req, res) => {
const { commentId } = req.params; // 🔁 Au lieu de req.params
  console.log('🆔 Commentaire ID reçu :', commentId);

  if (!commentId) {
    return res.status(400).json({ message: "commentId manquant" });
  }
  try {
    const result = await masquerCommentaire(commentId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
    publierSurFacebook,
  recupererCommentairesPublication,
    getNotificationsCount,
    resetNotificationsCount,
    recupererLikesPublication,
    getAllPublications,
    supprimerCommentairePublication,
    masquerCommentairePublication,
};
