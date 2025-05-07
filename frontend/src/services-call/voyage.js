import api from "./api"; // Assure-toi que ce fichier configure bien axios

const API_POINT = "/voyages";

const voyageService = {};

// 📥 Créer un voyage organisé (avec images)
voyageService.createVoyage = (data) => {
  const formData = new FormData();

  for (let key in data) {
    if (key === "image") {
      data.image.forEach((img) => {
        formData.append("image", img);
      });
    } else {
      formData.append(key, data[key]);
    }
  }

  return api.post(API_POINT, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 📄 Récupérer tous les voyages (avec params pour filtre/search/pagination)
voyageService.getAll = (params) => api.get(API_POINT, { params });

// 🔍 Récupérer un voyage par ID
voyageService.getById = (id) => api.get(`${API_POINT}/${id}`);

// ✏️ Modifier un voyage
voyageService.update = (id, data) => api.put(`${API_POINT}/${id}`, data);

// 🗑️ Supprimer un voyage
voyageService.deletee = (id) => api.delete(`${API_POINT}/${id}`);

// 🌍 Publier sur le site
voyageService.publishToSite = (id) =>
  api.post(`${API_POINT}/${id}/publish`);

export default voyageService;
