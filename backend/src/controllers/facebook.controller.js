const path = require('path');
const axios = require('axios');
const { PAGE_ACCESS_TOKEN, GRAPH_API_VERSION , PAGE_ID } = require('../config/facebook.config');
const publicationService = require('../services/publication.service');
const voyageService = require("../services/voyageorganise.service");
const omraService = require('../services/omra.service'); // service similaire à voyageorganise.service
const { publishToFacebook , getPublications,recupererCommentaires,supprimerCommentaire, masquerCommentaire ,recupererLikes,  verifierPublicationFacebook
} = require('../services/facebook.service');

const { Voyage ,Omra , Commentaire} = require('../models');

// ✅ Publier un voyage sur Facebook
const publierSurFacebook = async (id) => {
 
  console.log("📢 Publication Facebook reçue pour ID voyage :", id);
  // ... suite du traitement ...


  try {

    const voyage = await Voyage.findByPk(id);
    if (!voyage) {
      console.error('Voyage non trouvé');
  throw new Error("Voyage introuvable");
    }

    console.log('Voyage récupéré :', voyage);


    const now = new Date();
if (new Date(voyage.date_de_depart) < now) {
  console.warn("❌ La date de départ est déjà passée. Impossible de publier.");
  return { message: "Impossible de publier : la date de départ est déjà passée." };
    }
    

    // 2. Vérifier si publication Facebook existe déjà
    const publicationExistante = await publicationService.getByPlatformAndVoyage('facebook', id);
    if (publicationExistante) {
console.warn("⚠️ Publication déjà existante sur Facebook pour ce voyage.");
  return { message: 'Ce voyage a déjà été publié sur Facebook.', dejaPublie: true };    } 
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
📍 Description: ${voyage.description}
💰 Prix : ${voyage.prix} €
📅 Date de départ : ${voyage.date_de_depart}
📅 Date de retour : ${voyage.date_de_retour} 
🔗 Réservez votre place ici : https://1ed6-154-248-34-163.ngrok-free.app/web/infos_voyage/${voyage.id}`;
    
    // ✅ Publication sur Facebook
    const result = await publishToFacebook(message, localImagePaths);
    console.log('📨 Réponse Facebook :', result);
    
    

    // ✅ Vérification avant l'enregistrement
    const existeSurFacebook = await verifierPublicationFacebook(result.post_id);
    if (!existeSurFacebook) {
      console.warn("⚠️ La publication n'existe pas sur Facebook, annulation de l'enregistrement.");
      return { message: 'Échec de la publication sur Facebook. Vérifiez l\'ID.' };
    }



    // ✅ Enregistrement du post_id dans la BDD
    voyage.facebook_post_id = result.post_id || result.id;
    await voyage.save();


    //insérer dans la table publication
    await publicationService.publier({
      plateforme: 'facebook',
      id_voyage: id,
      id_post_facebook: result.post_id || result.id,
      url_post: `https://www.facebook.com/${result.post_id || result.id}`
    });

    // Modifier voyage vers `est_Publie: true`)
    const updatedVoyage = await voyageService.updateVoyage(id, { est_publier: true });

    console.log("Voyage mis à jour : ", updatedVoyage);
        console.log("✅ Voyage marqué comme publié sur fb :",  result.post_id);
    
  // ✅ Envoyer réponse une seule fois
  return ({ message: 'Publié sur Facebook', postId: result.post_id });

} catch (error) {
  console.error("❌ Erreur lors de la publication :", error.message);
  return ({ message: 'Erreur Facebook', error: error.message });
}
};


// publier sur faceboook seulement sans multiple 
// ✅ Route Express qui utilise req/res
const publierSurFacebookSeule = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await publierSurFacebook(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};





//publier omra sur fb
const publierOmraSurFacebook = async (id) => {
  try {
    // Récupérer l'Omra par son id
    const omra = await Omra.findByPk(id);
    if (!omra) {
      console.error('Omra non trouvée');
      throw new Error("Omra introuvable");
    }

    console.log('Omra récupérée :', omra);


    const now = new Date();
if (new Date(omra.date_de_depart) < now) {
  console.warn("❌ La date de départ de l'Omra est dépassée. Publication refusée.");
  return { message: "Impossible de publier : la date de départ est dépassée." };
    }
    
    // Vérifier si la publication Facebook existe déjà
    const publicationExistante = await publicationService.getByPlatformAndOmra('facebook', id);
    console.log('publicationExistante:', publicationExistante);
    if (publicationExistante) {
      console.warn("⚠️ Publication déjà existante sur Facebook pour cette Omra.");
      return {
    status: 200,
    body: { message: 'Cette Omra a déjà été publiée sur Facebook.' }
  };
    }

    // Gestion des images : soit tableau JSON, soit simple string
    let images = [];

try {
  if (omra.image) {
    if (omra.image.startsWith('[')) {
      images = JSON.parse(omra.image);
      if (!Array.isArray(images)) {
        throw new Error("Le champ 'image' n'est pas un tableau valide");
      }
    } else {
      images = [omra.image];
    }
  } else {
    throw new Error("Aucune image trouvée dans l'Omra");
  }
} catch (error) {
  console.error("Erreur lors du traitement de l'image :", error.message);
  return { message: 'Le format de l\'image est incorrect' };
}

    // Générer les chemins locaux pour les images
    const localImagePaths = images.map(image =>
      path.join(__dirname, '..', 'public', 'images', image)
    );

    // Message à publier (adapté aux données Omra)
    const message = `🕋 Nouvelle Omra disponible : ${omra.titre}
📍 Description : ${omra.description}
💰 Prix : ${omra.prix} €
📅 Date de départ : ${omra.date_de_depart}
📅 Durée : ${omra.duree}
🔗 Réservez ici : https://1ed6-154-248-34-163.ngrok-free.app/web/infos_omra/${omra.id}`;

    // Publication sur Facebook
    const result = await publishToFacebook(message, localImagePaths);
    console.log('Réponse Facebook :', result);

    // Vérification de la publication sur Facebook
    const existeSurFacebook = await verifierPublicationFacebook(result.post_id);
    if (!existeSurFacebook) {
      return { message: 'Échec de la publication sur Facebook. Vérifiez l\'ID.' };
    }

    // Mise à jour de la table Omra
    omra.facebook_post_id = result.post_id || result.id;
    await omra.save();

    // Insertion dans la table publication
    await publicationService.publier({
      plateforme: 'facebook',
      id_omra: id,   // attention : si ton champ s'appelle id_omra, adapte ici
      id_post_facebook: result.post_id || result.id,
      url_post: `https://www.facebook.com/${result.post_id || result.id}`
    });

    // Marquer comme publié
    const updatedOmra = await omraService.updateOmra(id, { est_publier: true });
    console.log("Omra mise à jour :", updatedOmra);

    return { message: 'Publié sur Facebook', postId: result.post_id };

  } catch (error) {
    console.error("Erreur lors de la publication Omra :", error.message);
    return { message: 'Erreur Facebook', error: error.message };
  }
};





// publier sur faceboook seulement sans multiple 
// ✅ Route Express qui utilise req/res
const publierOmraSurFacebookSeule = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await publierOmraSurFacebook(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
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
 const { id_post_facebook } = req.params;
  const cleanPostId = id_post_facebook.trim();

  console.log('ID de la publication Facebook:', cleanPostId);
try {
   

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
  const { id_post_facebook } = req.params;

console.log('ID de la publication Facebook:',id_post_facebook);

try {
  
    // Récupérer les likes en fonction de facebook_post_id
    const likes = await recupererLikes(id_post_facebook);  // Appeler la fonction pour récupérer les likes
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
    // 1️⃣ Trouver le commentaire dans la base pour obtenir l'ID Facebook
    const commentaire = await Commentaire.findByPk(commentId);

    if (!commentaire) {
      return res.status(404).json({ message: "Commentaire non trouvé en base de données." });
    }

    const id_commentaire_facebook = commentaire.id_commentaire_facebook;

    if (!id_commentaire_facebook) {
      return res.status(400).json({ message: "Ce commentaire n'est pas lié à Facebook." });
    }

    // 2️⃣ Supprimer sur Facebook et en base de données
    const reponse = await supprimerCommentaire(id_commentaire_facebook);

    // 4️⃣ Répondre au client
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
  publierSurFacebookSeule,
  publierOmraSurFacebook,
  publierOmraSurFacebookSeule,
  recupererCommentairesPublication,
    getNotificationsCount,
    resetNotificationsCount,
    recupererLikesPublication,
    getAllPublications,
    supprimerCommentairePublication,
  masquerCommentairePublication,
    
};
