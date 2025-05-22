import api from "./api";

const API_POINT = "/facebook";

const facebookService = {
  // Récupérer tous les commentaires d'une publication Facebook par son ID
  getAllByPublication: (id_post_facebook) =>
    api.get(`${API_POINT}/${id_post_facebook}/commentaires`),

  // Récupérer le nombre actuel de notifications (nouveaux commentaires)
  getNotificationsCount: () =>
    api.get(`${API_POINT}/notifications/count`),

  // Réinitialiser le compteur de notifications à zéro
  resetNotificationsCount: () =>
    api.post(`${API_POINT}/notifications/reset`),

  // Récupérer tous les likes d'une publication Facebook par son ID
  getLikesByPublication: (id_post_facebook) =>
    api.get(`${API_POINT}/${id_post_facebook}/likes`),

  // Supprimer un commentaire par son ID
  supprimerCommentaire: (commentId) =>
    api.delete(`${API_POINT}/commentaires/${commentId}`),

  // Masquer un commentaire par son ID
  masquerCommentaire: (commentId) =>
    api.post(`${API_POINT}/commentaires/${commentId}/masquer`),
};

export default facebookService;
