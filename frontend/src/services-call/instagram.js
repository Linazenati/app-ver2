import api from "./api"; // ton instance Axios

const API_POINT = "/instagram";

const instagramService = {
  // 📥 Récupérer tous les commentaires d'une publication Instagram
  recupererCommentairesPublication: (instagram_post_id) =>
    api.get(`${API_POINT}/${instagram_post_id}/commentaires`),

  // 🔔 Récupérer le nombre actuel de notifications (nouveaux commentaires détectés)
  getNotificationsCount: () =>
    api.get(`${API_POINT}/notifications/count`),

  // 🔔 Réinitialiser le compteur de notifications à zéro
  resetNotificationsCount: () =>
    api.post(`${API_POINT}/notifications/reset`),

  // ✅ Supprimer un commentaire Instagram
  supprimerCommentaire: (commentId) =>
    api.delete(`${API_POINT}/commentaires/${commentId}`),

  // ✅ Masquer un commentaire Instagram
  masquerCommentaire: (commentId) =>
    api.post(`${API_POINT}/commentaires/${commentId}/masquer`),

  // 👍 Récupérer les likes d'une publication Instagram
  recupererLikesPublication: (instagram_post_id) =>
    api.get(`${API_POINT}/${instagram_post_id}/likes`),

  // ✏️ Publier un voyage sur Instagram par ID
  publierSurInstagram: (id) =>
    api.post(`${API_POINT}/${id}/publier`),

  // 📥 Récupérer toutes les publications Instagram
  getAllInstagramPublications: () =>
    api.get(`${API_POINT}/publications`)
};

export default instagramService;
