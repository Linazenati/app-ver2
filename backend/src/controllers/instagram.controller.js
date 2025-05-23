// controllers/instagram.controller.js
const fs = require('fs');

const path = require('path');
const { publishCarouselInstagram ,getPublications,recupererCommentaires,supprimerCommentaire,masquerCommentaire,recupererLikes,verifierPublicationInstagram,getInstagramShortcode} = require('../services/instagram.service');
const uploadToCloudinary = require('../middlewares/cloudinaryUpload');
const { Voyage} = require('../models');
const publicationService = require('../services/publication.service');
const voyageService = require("../services/voyageorganise.service");

/**
 * Contrôleur pour publier un voyage sur Instagram en carrousel.
 */
const publierSurInstagram = async (id) => {
  try {
    // 1️⃣ Récupération du voyage
    const voyage = await Voyage.findByPk(id);
   if (!voyage) {
      console.error('Voyage non trouvé');
  throw new Error("Voyage introuvable");
    }

    // 2. Vérifier si publication Facebook existe déjà
    const publicationExistante = await publicationService.getByPlatformAndVoyage('instagram', id);
    if (publicationExistante) {
     throw new Error({ message: 'Ce voyage a déjà été publié sur instagram.' });
    } 

    // 3️⃣ Parser et vérifier les images
    let images;
    try {
      images = JSON.parse(voyage.image || '[]');
      if (!Array.isArray(images) || images.length === 0) throw new Error();
    } catch {
      return res.status(400).json({ message: 'Aucune image valide.' });
    }

    // 4️⃣ Préparer la légende
    const caption =
  `🌍 Nouveau voyage : ${voyage.titre}\n` +
  `📍 Description : ${voyage.description}\n` +
  `💰 Prix : ${voyage.prix} €\n` +
  `📅 Date de départ : ${voyage.date_de_depart}\n` +
  `📅 Date de retour : ${voyage.date_de_retour}\n` +
  `🔗 Réservez votre place ici : https://1ed6-154-248-34-163.ngrok-free.app/web/infos_voyage/${voyage.id}`;

    // 5️⃣ Upload local -> Cloudinary
    const imageUrls = [];
    for (const file of images) {
      const localPath = path.join(__dirname, '..', 'public', 'images', file);
      console.log("🖼️ Tentative d'upload pour :", localPath);

  // Vérifiez si le fichier existe
  if (!fs.existsSync(localPath)) {
    console.error("❌ Fichier introuvable :", localPath);
    return { message: `Fichier introuvable : ${localPath}` };
  }

      const publicUrl = await uploadToCloudinary(localPath);
      imageUrls.push(publicUrl);
    }
    console.log('🖼️ URLs Cloudinary :', imageUrls);

    // 6️⃣ Publier en carousel
    const result = await publishCarouselInstagram(imageUrls, caption);


    // 7️⃣ Vérifier l'existence sur Instagram avant de sauvegarder
const existeSurInstagram = await verifierPublicationInstagram(result.post_id);
if (!existeSurInstagram) {
  console.warn("⚠️ La publication n'existe pas sur Instagram, annulation de l'enregistrement.");
  return { message: 'Échec de la publication sur Instagram. Vérifiez l\'ID.' };
    }
    
    
// ✅ Récupérer le shortcode
const shortcode = await getInstagramShortcode(result.post_id);
const instagramURL = `https://www.instagram.com/p/${shortcode}`;


    // 7️⃣ Enregistrer l'ID Instagram
    voyage.instagram_post_id = result.post_id;
    await voyage.save();

    //insérer dans la table publication
    await publicationService.publier({
      plateforme: 'instagram',
      id_voyage: id,
      id_post_instagram: result.post_id,
      url_post: instagramURL,
    });

    // Modifier voyage vers `est_Publie: true`)
    const updatedVoyage = await voyageService.updateVoyage(id, { est_publier: true });

    
    console.log("Voyage mis à jour : ", updatedVoyage);
        console.log("✅ Voyage marqué comme publié sur instagram :",  result.post_id);

return ({ message: 'Publié sur Instagram', instagram_post_id: result.post_id });

} catch (error) {
  console.error("Erreur Instagram :", error.message);
  return ({ message: 'Erreur Instagram', error: error.message });
}
};



//publier instagram seulement sans multiple
const publierSurInstagralSeule = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await publierSurInstagram(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//recuperer tous les publications 
const getAllInstagramPublications = async (req, res) => {
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
 const { instagram_post_id } = req.params;
  const cleanPostId = instagram_post_id.trim();

  console.log('ID de la publication instagram:', cleanPostId);

  try {
    if (!cleanPostId) {
      return res.status(400).json({ message: 'Le instagram_post_id est nécessaire pour récupérer les commentaires' });
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

// 📝 Supprimer un commentaire
const supprimerCommentairePublication = async (req, res) => {
  const { commentId } = req.params;
  console.log('🔍 Suppression du commentaire instgram...');
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

// 📝 Récupérer les nmbr likes d'une publication
const recupererLikesPublication = async (req, res) => {
  const { instagram_post_id } = req.params;
console.log('ID de la publication instagram:', instagram_post_id);

try {
  
    // Récupérer les likes en fonction de facebook_post_id
    const likes = await recupererLikes(instagram_post_id);  // Appeler la fonction pour récupérer les likes
    res.status(200).json(likes);  // Retourner les likes
  } catch (error) {
    res.status(500).json({ message: error.message });  // Gestion des erreurs
  }
};

module.exports =
{
  publierSurInstagram,
  publierSurInstagralSeule,
    recupererCommentairesPublication,
     getNotificationsCount,
    resetNotificationsCount,
    getAllInstagramPublications,
    supprimerCommentairePublication,
    masquerCommentairePublication,
    recupererLikesPublication
};
