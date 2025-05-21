// services/instagram.service.js

const axios = require('axios');
const { IG_ACCESS_TOKEN, INSTAGRAM_USER_ID, GRAPH_API_VERSION } = require('../config/instagram.config');
const { sauvegarderCommentaires , supprimerCommentaireEnBase} = require('./commentaire.service');
const { Publication , Commentaire} = require('../models');
/**
 * Crée un container média pour une image (carousel item) sur Instagram.
 * @param {string} imageUrl - URL publique de l'image
 * @returns {Promise<string>} - ID du container créé
 */


async function createMediaContainer(imageUrl, isCarouselItem = false) {
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${INSTAGRAM_USER_ID}/media`;
  try {
    const params = {
      image_url: imageUrl,
      access_token: IG_ACCESS_TOKEN,
    };

    // ajouter ce champ seulement si c'est un enfant de carrousel
    if (isCarouselItem) {
      params.is_carousel_item = true;
    }

    const response = await axios.post(url, null, {
      params,
      timeout: 20000
    });

    console.log('✅ Container média créé, ID :', response.data.id);
    return response.data.id;
  } catch (err) {
  console.error('❌ Erreur création container média :', JSON.stringify(err.response?.data || err.message, null, 2));
      throw new Error('Échec création media container Instagram');
  }
}
/**
 * Crée le container CAROUSEL qui regroupe tous les éléments média.
 * @param {string[]} childrenIds - IDs des containers média enfants
 * @param {string} caption - légende du post
 * @returns {Promise<string>} - ID du container carousel
 */


async function createCarouselContainer(childrenIds, caption) {
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${INSTAGRAM_USER_ID}/media`;
  try {
    const response = await axios.post(url, null, {
      params: {
        children: childrenIds.join(','), // 'id1,id2,...'
        
        media_type: 'CAROUSEL',          // type carrousel
        caption: caption,                // légende
        access_token: IG_ACCESS_TOKEN,
      }
    });
    console.log('✅ Container carousel créé, ID :', response.data.id);
    return response.data.id;
  } catch (err) {
    console.error('❌ Erreur création container carousel :', err.response?.data || err.message);
    throw new Error('Échec création carousel container Instagram');
  }
}

/**
 * Publie un container média carrousel sur le feed Instagram.
 * @param {string} creationId - ID du container carousel
 * @returns {Promise<string>} - ID du post publié
 */
async function publishCarousel(creationId) {
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${INSTAGRAM_USER_ID}/media_publish`;
  try {
    const response = await axios.post(url, null, {
      params: {
        creation_id: creationId,
        access_token: IG_ACCESS_TOKEN
      },
        timeout: 120000  // ⏰ 120 secondes
    });



    console.log('✅ Carousel publié, post_id :', response.data.id);
    return response.data.id;
  } catch (err) {
    console.error('❌ Erreur publication carousel :', err.response?.data || err.message);
    throw new Error('Échec publication carousel Instagram');
  }
}

/**
 * Flux complet pour publier un carousel Instagram à partir d'URLs d'images publiques.
 * @param {string[]} imageUrls - URLs publiques des images à publier
 * @param {string} caption - Légende du post
 * @returns {Promise<{ post_id: string }>} - ID de la publication
 */
async function publishCarouselInstagram(imageUrls, caption) {
  try {
    // ✅ Initialisation de childrenIds
    let childrenIds = [];

    // 📸 Cas 1 : Une seule image
    if (imageUrls.length === 1) {
  const mediaId = await createMediaContainer(imageUrls[0], false); // image simple
  const postId = await publishCarousel(mediaId); // fonctionne pour image simple
  return { post_id: postId };
} 
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

for (const url of imageUrls) {
  const id = await createMediaContainer(url, true);
  childrenIds.push(id);
  console.log("🧩 Children IDs :", childrenIds);
  await wait(12000); // 1.5 sec entre les requêtes
}
    
  // 2. Créer le container carousel
  const carouselId = await createCarouselContainer(childrenIds, caption);

  // 3. Publier le carousel sur le feed
  const postId = await publishCarousel(carouselId);

    return { post_id: postId };
    }  catch (error) {
  console.error("❌ Erreur Instagram :", JSON.stringify(error.response?.data || error, null, 2));
  throw new Error("Échec publication carousel Instagram");
}
}



async function getInstagramShortcode(instagramPostId) {
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${instagramPostId}?fields=permalink&access_token=${IG_ACCESS_TOKEN}`;
  try {
    const response = await axios.get(url);
    const permalink = response.data.permalink; // ex: https://www.instagram.com/p/C7P4Ef1Labc/
    
    const shortcode = permalink.split("/p/")[1].replace("/", "");
    return shortcode;
  } catch (error) {
    console.error("❌ Erreur récupération shortcode :", error.message);
    throw new Error("Impossible de récupérer le shortcode Instagram");
  }
}
// 📥 Récupérer la liste des publications Instagram
const getPublications = async () => {
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${INSTAGRAM_USER_ID}/media`;

  try {
    const response = await axios.get(url, {
      params: {
        access_token: IG_ACCESS_TOKEN,
        fields: 'id,caption,media_type,media_url,permalink,timestamp'
      }
    });
    return response.data.data; // tableau des publications
  } catch (error) {
    console.error('❌ Erreur récupération publications Instagram :', error.response?.data || error.message);
    throw new Error('Impossible de récupérer les publications Instagram');
  }
};

// 📝 Récupérer les commentaires d'une publication
const recupererCommentaires = async (instagram_post_id) => {
  try {
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${instagram_post_id}/comments`;
    const response = await axios.get(url, {
      params: {
        access_token: IG_ACCESS_TOKEN,
      },
                  timeout: 60000, // ⏰ 10 secondes (ajoute cette ligne)
    });
     
    const commentaires = response.data.data;
    console.log('✅ Commentaires récupérés :', commentaires);
    
    // 2. Trouver la publication correspondante dans ta DB
  // 🔍 Trouve la publication correspondante en base de données
    const publication = await Publication.findOne({
      where: { id_post_instagram: instagram_post_id }
    });

    if (!publication) {
      console.warn("⚠️ Aucune publication trouvée pour cet ID Instagram");
      return [];
    }

    // 💾 Sauvegarde les commentaires dans la base de données
    await sauvegarderCommentaires(publication.id, commentaires);
    console.log('✅ Commentaires sauvegardés avec succès.');

    return commentaires;
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error.response?.data || error.message);
    throw new Error('Erreur lors de la récupération des commentaires');
  }
};



// 📝 Supprimer un commentaire
const supprimerCommentaire = async (commentId) => {
  try {
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${commentId}`;
    console.log('📡 Suppression en cours...');
    console.log('🔗 URL appelée :', url);

    const response = await axios.delete(url, {
      params: {
        access_token: IG_ACCESS_TOKEN,
      },
                  timeout: 60000, // ⏰ 60 secondes (ajoute cette ligne)

    });
     console.log('✅ Réponse Instagram (suppression réussie) :', response.data);

    // 🔍 Récupérer le commentaire pour obtenir l'ID de la publication associée
const commentaire = await Commentaire.findOne({
  where: { id_commentaire_instagram: commentId },
});

if (!commentaire) {
  console.warn("⚠️ Aucun commentaire trouvé pour cet ID en base de données.");
  return response.data;
}

// Suppression en base de données
await supprimerCommentaireEnBase(commentId, commentaire.id_publication, 'instagram');
console.log('✅ Commentaire supprimé en base de données.');
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
        access_token: IG_ACCESS_TOKEN,
        hide: true,
      },
    });
    console.log('✅ Réponse Instaram (masquage réussie) :', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du masquage du commentaire:', error.response?.data || error.message);
    throw new Error('Erreur lors du masquage du commentaire');
  }
}

// 📝 Récupérer les Likes d'une publication
const recupererLikes = async (instagram_post_id) => {
 try {
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${instagram_post_id}?fields=like_count`;
    const response = await axios.get(url, {
      params: {
        access_token: IG_ACCESS_TOKEN,
      },
                              timeout: 60000, // ⏰ 10 secondes (ajoute cette ligne)

    });

    const nombreLikes = response.data.like_count || 0;
    console.log('✅ Nombre de Likes :', nombreLikes);

    return nombreLikes;
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de likes:', error.response?.data || error.message);
    throw new Error('Erreur lors de la récupération du nombre de likes');
  }


};

// 📝 Vérifier l'existence d'une publication Instagram
const verifierPublicationInstagram = async (instagram_post_id) => {
  try {
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${instagram_post_id}`;
    const response = await axios.get(url, {
      params: {
        access_token: IG_ACCESS_TOKEN,
        fields: 'id,caption,media_type,media_url,permalink,timestamp'
      },
      timeout: 60000  // ⏰ 60 secondes
    });

    // Si on obtient une réponse avec l'ID, la publication existe
    console.log('✅ Publication Instagram vérifiée, ID :', response.data.id);
    return true;
  } catch (error) {
    console.error('❌ Erreur vérification publication Instagram :', error.response?.data || error.message);
    return false;
  }
};

module.exports = {
  publishCarouselInstagram,
  getPublications,
  recupererCommentaires,
  supprimerCommentaire,
  masquerCommentaire,
  recupererLikes,
  verifierPublicationInstagram,
  getInstagramShortcode
};
