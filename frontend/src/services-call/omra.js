import api from "./api"; // Assure-toi que ce fichier configure bien axios

const API_POINT = "/omra";

const omraService = {};

// 📥 Créer une Omra (avec image)
omraService.create = (formData) => {
  return api.post(API_POINT, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 📄 Récupérer toutes les Omras (filtrage/pagination possible via params)
omraService.getAll = (params) => api.get(API_POINT, params);

// 🔍 Récupérer une Omra par ID
omraService.getById = (id) => api.get(`${API_POINT}/${id}`);

// ✏️ Modifier une Omra
omraService.update = (id, data) => api.put(`${API_POINT}/${id}`, data);

// 🗑️ Supprimer une Omra
omraService.deletee = (id) => api.delete(`${API_POINT}/${id}`);

// 🌍 Publier une Omra sur le site
omraService.publierSurSiteSeule = (id) => api.post(`${API_POINT}/${id}/publish`);

// 📄 Obtenir toutes les Omras publiées sur le site
omraService.getOmraPubliesSurSite = (token) => {
  return api.get(`${API_POINT}/publies/site`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 🔍 Détails d'une Omra avec commentaires des réseaux
omraService.getDetailsOmra = (id) => api.get(`${API_POINT}/publies/siteCommentaire/${id}`);

export default omraService;
