import api from "./api"; // Ton instance Axios personnalisée

const API_POINT = "/amadeus/vols"; // Point de base pour Amadeus

const amadeusService = {};

// Recherche de vols
amadeusService.searchFlights = (params, token) =>
  api.post(`${API_POINT}/search`, params, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export default amadeusService;
