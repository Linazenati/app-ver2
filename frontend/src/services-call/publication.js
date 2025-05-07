import api from "./api"; // ton instance Axios

const API_POINT = "/publication";

const publicationService = {};

// 📤 Publier un voyage sur plusieurs plateformes
publicationService.publierMulti = (id, plateformes) =>
  api.post(`${API_POINT}/${id}/publier-multi`, { plateformes });

// 📥 Récupérer toutes les publications
publicationService.getAll = (params) =>  api.get(`${API_POINT}`, { params  });

// 📥 Récupérer une publication spécifique
publicationService.getById = (id) =>
  api.get(`${API_POINT}/${id}`);

export default publicationService;