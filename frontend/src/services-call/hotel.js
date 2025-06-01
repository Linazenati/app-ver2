import api from "./api";

const API_POINT = "/hotel";

const hotelService = {};



// GET /villes
hotelService.getAllVilles = (region) => api.get(`${API_POINT}/ville/${region}`);



hotelService.getVilleById=(villeId) => 
  api.get(`${API_POINT}/by-id/${villeId}`);


///recuperer le hotels par ville
hotelService.getHotelsByVilleId = (villeId) => api.get(`${API_POINT}/par-ville/${villeId}`);


// Route pour rechercher et sauvegarder les hôtels via Booking
hotelService.searchAndSaveHotelsForVille = (params) => api.get(`${API_POINT}/search-and-save-hotels`, { params });


hotelService.getHotelById = (id) => api.get(`${API_POINT}/${id}`);

hotelService.create = (data) => api.post(`${API_POINT}/ville`, data);




  // GET /api/v1/villes/search-and-save-hotels?...
hotelService.getAll = (params) => api.get(API_POINT, { params });

  // DELETE /api/v1/villes/:id
  hotelService.remove = (id) => api.delete(`${API_POINT}/${id}`);
export default hotelService;
