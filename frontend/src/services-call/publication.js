import api from "./api"; // ton instance Axios

const API_POINT = "/publication";

const publicationService = {};

// 📤 Publier un voyage sur plusieurs plateformes
publicationService.publierMulti = async (id, plateformes, type) =>
  await api.post(`${API_POINT}/${id}/publier-multi`, { plateformes, type });


  
// 📤 Publier un voyage sur plusieurs plateformes
publicationService.publiermultiOmra = async (id, plateformes, type) =>
  await api.post(`${API_POINT}/${id}/publier-multiOmra`, { plateformes, type });

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


  
  // 📥 Récupérer les publications d'une omra publié (par ID)
publicationService.getPublicationsByOmraId = (id) =>
  api.get(`${API_POINT}/omras/${id}/publications`);


  
// ✅ Nouvelle route : Récupérer les likes d'une publication avec cache
publicationService.getLikesByPostId = async (plateforme, id_post) =>
  await api.get(`${API_POINT}/publication/likes`, {
    params: { plateforme, id_post }
  });

export default publicationService;