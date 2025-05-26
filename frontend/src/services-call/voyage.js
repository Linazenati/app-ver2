import api from "./api"; // Assure-toi que ce fichier configure bien axios

const API_POINT = "/voyages";



// envoyer / creer un voyage
const voyageService = {};
voyageService.createVoyage = (formData) => {
  return api.post(API_POINT, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 📄 Récupérer tous les voyages (avec params pour filtre/search/pagination)
voyageService.getAll = (params) => api.get(API_POINT, params);

// 🔍 Récupérer un voyage par ID
voyageService.getById = (id) => api.get(`${API_POINT}/${id}`);

// ✏️ Modifier un voyage
voyageService.update = (id, data) => api.put(`${API_POINT}/${id}`, data);

// 🗑️ Supprimer un voyage
voyageService.remove = (id) => api.delete(`${API_POINT}/${id}`);

// 🌍 Publier sur le site
voyageService.publishToSite = (id) =>
  api.post(`${API_POINT}/${id}/publish`);

  
// 🔍 Récupérer les voyages publiés sur le site
voyageService.getVoyagesPubliesSurSite = () =>
  api.get(`${API_POINT}/publies/site`);

  // 🔍 Récupérer un voyage publié sur site avec commentaires des réseaux sociaux
voyageService.getVoyagePublieAvecCommentaires = (id) =>
  api.get(`${API_POINT}/publies/siteCommentaire/${id}`);

  
export default voyageService;