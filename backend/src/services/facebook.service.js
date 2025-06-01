// services/facebook.service.js

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const { PAGE_ACCESS_TOKEN, PAGE_ID, GRAPH_API_VERSION } = require('../config/facebook.config');
const { sauvegarderCommentaires , supprimerCommentaireEnBase } = require('./commentaire.service');
const { Publication , Commentaire } = require('../models');
const { peutPublier, incrementerPublication,getEtatQuota } = require('./throttle.service');
const quotaService = require('../services/recuperationQuota.service');


const publishToFacebook = async (message, localImagePaths) => {
  const quota =  await getEtatQuota();
    console.log("📊 État actuel du quota publication :", quota);

  // 🔐 Vérifie le quota avant de publier
  if (!peutPublier()) {
    console.log("🚫 Trop de publications Facebook. Réessaye plus tard.");
    throw new Error("Limite de publications atteinte.");
  }

  try {
    const mediaFbIds = [];

    // ✅ Étape 1 : Pour chaque image, on fait un upload "non publié"
    for (const imagePath of localImagePaths) {
      const form = new FormData();
      form.append('access_token', PAGE_ACCESS_TOKEN);
      form.append('published', 'false'); // important pour ne pas publier chaque image séparément
      form.append('source', fs.createReadStream(imagePath)); // on lit l'image depuis le disque

      const response = await axios.post(
        `https://graph.facebook.com/${GRAPH_API_VERSION}/${PAGE_ID}/photos`,
        form,
        { headers: form.getHeaders() , timeout: 600000 }
      );

      // ✅ On récupère l'id de l'image pour l'associer plus tard à la publication principale
      mediaFbIds.push({ media_fbid: response.data.id });
    }

    console.log('✅ IDs des images uploadées (non publiées) :', mediaFbIds);

    // ✅ Étape 2 : On crée UNE seule publication avec le texte + les images déjà uploadées
    const postResponse = await axios.post(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${PAGE_ID}/feed`,
      {
        access_token: PAGE_ACCESS_TOKEN,
        message: message,
        attached_media: mediaFbIds // On attache toutes les images ici
      }

    );
// ✅ Publication réussie
    await incrementerPublication(); // ➕ Mise à jour du quota après succès
      console.log("🔁 Incrémentation publication appelée");
  console.log("✅ Publication Facebook réussie et quota mis à jour !");


    // ✅ La publication a été créée avec succès
    return { post_id: postResponse.data.id };

 } catch (error) {
  const errorData = error.response?.data || error.message;
  console.error("❌ Erreur lors de la publication sur Facebook :", errorData);

  // 🔍 Gestion spécifique pour les erreurs réseau ou quota
  if (error.code === 'ETIMEDOUT') {
    console.error("⏱️ Temps d'attente dépassé (timeout) lors de la requête Facebook.");
  } else if (error.response?.status === 429) {
    console.error("🚫 Erreur de quota : trop de requêtes envoyées.");
  }

  // Tu peux aussi propager l'erreur à un appelant si nécessaire :
  throw new Error("Échec de la publication Facebook : " + errorData?.error?.message || error.message);
}
};

//recupérer la liste des publications
const getPublications = async () => {
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PAGE_ID}/posts?access_token=${PAGE_ACCESS_TOKEN}`;

  try {
    const response = await axios.get(url);
    return response.data.data; // tableau des publications
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des publications :', error.response?.data || error.message);
    throw new Error("Impossible de récupérer les publications");
  }
};

// 📝 Récupérer les commentaires d'une publication
const recupererCommentaires = async (id_post_facebook) => {
  try {
    // Vérifier et afficher état du quota (optionnel, pour debug)
    const etatQuota = await quotaService.getEtatRecupQuota();
    console.log("📊 État actuel des quotas :", etatQuota);

    // Vérifier si on peut récupérer (via quota)
    if (
      etatQuota.recupMinuteRestante <= 0 ||
      etatQuota.recupHeureRestante <= 0 ||
      etatQuota.recupJourRestante <= 0
    ) {
      console.warn("🚫 Quota de récupération atteint.");
      return []; // ou throw une erreur custom
    }

    // Incrémenter le quota car on lance une récupération
    await quotaService.incrementerQuota();
   

    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${id_post_facebook}/comments`;
    const response = await axios.get(url, {
      params: {
        access_token: PAGE_ACCESS_TOKEN,
      },
                  timeout: 200000, // ⏰ 10 secondes (ajoute cette ligne)

    });
  const commentaires = response.data.data;
    console.log('✅ Commentaires récupérés :', commentaires);

    const publication = await Publication.findOne({
      where: { id_post_facebook: id_post_facebook},
    });

    if (!publication) {
      console.warn("⚠️ Aucune publication trouvée pour cet ID Facebook");
      return [];
    }

    await sauvegarderCommentaires(publication.id, commentaires, 'facebook');
    console.log('✅ Commentaires sauvegardés avec succès.');
  
    return commentaires;
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires Facebook:', error.response?.data || error.message);
    throw new Error('Erreur lors de la récupération des commentaires Facebook');
  }

};

// 📝 Récupérer les Likes d'une publication
const recupererLikesFacebook = async (id_post_facebook) => {
 try {
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${id_post_facebook}?fields=reactions.summary(true)`;
    const response = await axios.get(url, {
      params: {
        access_token: PAGE_ACCESS_TOKEN,
      },
                        timeout: 200000, // ⏰ 10 secondes (ajoute cette ligne)

    });

    const nombreLikes = response.data.reactions?.summary?.total_count || 0;
    console.log('✅ Nombre de Likes facebook:', nombreLikes);

    return nombreLikes;
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de likes:', error.response?.data || error.message);
    throw new Error('Erreur lors de la récupération du nombre de likes');
  }
};




// 📝 Supprimer un commentaire
const supprimerCommentaire = async (id_commentaire_facebook) => {
   try {
    const etatSuppQuota = await quotaService.getEtatSuppQuota();

  if (
    etatSuppQuota.suppMinuteRestante <= 0 ||
    etatSuppQuota.suppHeureRestante <= 0 ||
    etatSuppQuota.suppJourRestante <= 0
  ) {
    throw new Error('Quota de suppression dépassé');
  }

  await quotaService.incrementerSuppQuota();
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${id_commentaire_facebook}`;
    console.log('📡 Suppression Facebook en cours...');
    console.log('🔗 URL appelée :', url);

    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
      },
      timeout: 20000,
    });

    console.log('✅ Réponse Facebook :', response.data);

    // Recherche en base
    const commentaire = await Commentaire.findOne({
      where: { id_commentaire_facebook },
    });

    if (!commentaire) {
      console.warn("⚠️ Aucun commentaire trouvé en base.");
      return response.data;
    }

    // Suppression en base
    await supprimerCommentaireEnBase(id_commentaire_facebook, commentaire.id_publication, 'facebook');
    console.log('✅ Commentaire supprimé en base.');
    return response.data;

  } catch (error) {
    console.error('❌ Erreur lors de la suppression du commentaire :');
    if (error.response) {
      console.error('📨 Erreur response data :', error.response.data);
      throw new Error(JSON.stringify(error.response.data));
    } else {
      console.error('🧨 Erreur inconnue :', error.message);
      throw new Error('Erreur inconnue lors de la suppression');
    }
  }
};

// 📝 Masquer un commentaire
const masquerCommentaire = async (commentId) => {
  try {
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${commentId}`;
    const response = await axios.post(url, null, {
      params: {
        access_token: PAGE_ACCESS_TOKEN,
        is_hidden: true,
      },
                        timeout: 90000, // ⏰ 10 secondes (ajoute cette ligne)

    });
     console.log('✅ Réponse Facebook (masquage réussie) :', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du masquage du commentaire:', error.response?.data || error.message);
    throw new Error('Erreur lors du masquage du commentaire');
  }
};


// ✅ Vérifier si une publication existe sur Facebook
const verifierPublicationFacebook = async (postId) => {
  try {
    const response = await axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/${postId}`, {
      params: { access_token: PAGE_ACCESS_TOKEN },
      timeout: 30000,
    });
    return response.data && response.data.id === postId;
  } catch (error) {
    console.warn('⚠️ Publication non trouvée sur Facebook :', error.response?.data || error.message);
    return false;
  }
};
module.exports = {
  publishToFacebook,
  getPublications,
  recupererLikesFacebook,
  recupererCommentaires,
  supprimerCommentaire,
  masquerCommentaire,
  verifierPublicationFacebook
};
