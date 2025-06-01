import api from "./api";  // Ton instance Axios configurée (baseURL, headers, etc.)

const API_POINT = "/commentaires";

const commentaireService = {
  // 📥 Récupérer et stocker les commentaires d'une publication Instagram (POST /commentaires)
  partagerCommentairesInstagram: (instagram_post_id, id_publication) =>
    api.post(`${API_POINT}`, { instagram_post_id, id_publication }),

  // ✅ Mettre à jour la sélection d'un commentaire (PUT /commentaires/selection)
  updateSelectionCommentaire: (id_commentaire_plateforme, plateforme, est_selectionne) =>
    api.put(`${API_POINT}/selection`, { id_commentaire_plateforme, plateforme, est_selectionne }),

  // 📥 Récupérer les commentaires sélectionnés selon la plateforme (GET /commentaires/partager?plateforme=instagram)
  getCommentairesSelectionnes: (plateforme) =>
    api.get(`${API_POINT}/partager`, { params: { plateforme } }),




 getCommentairesFacebook: (id_publication) =>
  api.get(`${API_POINT}/facebook/${id_publication}`),

getCommentairesInstagram: (id_publication) =>
    api.get(`${API_POINT}/instagram/${id_publication}`),
  

//recuperer les  noveau commentaire 
getNouveauxCommentaires: (id_publication) =>
  api.get(`${API_POINT}/nouveaux/${id_publication}`),

};



export default commentaireService;
