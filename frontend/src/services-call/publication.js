import api from "./api"; // ton instance Axios

const API_POINT = "/publication";

const publicationService = {};

// 📤 Publier un voyage sur plusieurs plateformes
publicationService.publierMulti = async (id, plateformes, type) =>
  await api.post(`${API_POINT}/${id}/publier-multi`, { plateformes, type });


// 📥 Récupérer toutes les publications
publicationService.getAll = async (params) => await api.get(`${API_POINT}`, { params  });

// 📥 Récupérer une publication spécifique
publicationService.getById = async (id) =>
  await api.get(`${API_POINT}/${id}`);

// 📥 Récupérer une publication spécifique
publicationService.getByIdOmra = async (idOmra) =>
  await api.get(`${API_POINT}/by_id_omra/${idOmra}`);

  // 📥 Récupérer les publications d'un voyage publié (par ID)
publicationService.getPublicationsByVoyageId = (id) =>
  api.get(`${API_POINT}/voyages/${id}/publications`);
  
export default publicationService;