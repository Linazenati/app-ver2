// services/instagram.service.js

const axios = require('axios');
const { IG_ACCESS_TOKEN, INSTAGRAM_USER_ID, GRAPH_API_VERSION } = require('../config/instagram.config');

/**
 * Crée un container média pour une image (carousel item) sur Instagram.
 * @param {string} imageUrl - URL publique de l'image
 * @returns {Promise<string>} - ID du container créé
 */
async function createMediaContainer(imageUrl) {
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${INSTAGRAM_USER_ID}/media`;
  try {
    const response = await axios.post(url, null, {
      params: {
        image_url: imageUrl,      // URL Cloudinary publique
        media_type: 'IMAGE',      // type image
        is_carousel_item: true,   // indique un élément de carrousel
        access_token: IG_ACCESS_TOKEN
      }
    });
    console.log('✅ Container média créé, ID :', response.data.id);
    return response.data.id;
  } catch (err) {
    console.error('❌ Erreur création container média :', err.response?.data || err.message);
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
        access_token: IG_ACCESS_TOKEN
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
      }
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
  // 1. Créer un container média pour chaque image
  const childrenIds = [];
  for (const url of imageUrls) {
    const id = await createMediaContainer(url);
    childrenIds.push(id);
  }

  // 2. Créer le container carousel
  const carouselId = await createCarouselContainer(childrenIds, caption);

  // 3. Publier le carousel sur le feed
  const postId = await publishCarousel(carouselId);

  return { post_id: postId };
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
    });
    return response.data.data;
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
    });
     console.log('✅ Réponse Instagram (suppression réussie) :', response.data);
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
    });

    const nombreLikes = response.data.like_count || 0;
    console.log('✅ Nombre de Likes :', nombreLikes);

    return nombreLikes;
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de likes:', error.response?.data || error.message);
    throw new Error('Erreur lors de la récupération du nombre de likes');
  }
};

module.exports = {
  publishCarouselInstagram,
  getPublications,
  recupererCommentaires,
  supprimerCommentaire,
  masquerCommentaire,
  recupererLikes
};
