import api from "./api";

const API_POINT = "/hotel";

const hotelService = {};

// GET /hotel/
hotelService.rechercher = (params) =>api.get(`${API_POINT}/`, { params  });


// GET /hotel/Recupererhotels
hotelService.recupererHotelByVille = (ville) => api.get(`${API_POINT}/Recupererhotels/${ville}`);


hotelService.getVillesByRegion = (region) => api.get(`${API_POINT}/villes/${region}`);


//recuperer temps réels

hotelService.searchRealTime = (params) => api.get(`${API_POINT}/recherche-temps-reel`, { params });



// Route pour récupérer un hôtel par ID
hotelService.getHotelById = (id) => api.get(`${API_POINT}/${id}`);

export default hotelService;
