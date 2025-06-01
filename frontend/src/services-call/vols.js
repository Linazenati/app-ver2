import api from "./api"; // Ton instance Axios

const API_POINT = "/vol";

const volsService = {};

volsService.searchAndSave = (searchParams, token) =>
  api.post(`${API_POINT}/search-and-save`, searchParams, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }); 
  
  // 🔎 Obtenir un vol par numéro de vol
volsService.getByNumeroVol = (numeroVol, token) =>
  api.get(`${API_POINT}/numero/${numeroVol}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
// 🔍 Récupérer tous les vols
volsService.getAll = (token) =>
  api.get(API_POINT, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// ➕ Créer un vol manuellement
volsService.create = (data, token) =>
  api.post(API_POINT, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

// 🔎 Obtenir un vol par ID
volsService.getById = (id, token) =>
  api.get(`${API_POINT}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// ✏️ Modifier un vol par ID
volsService.update = (id, data, token) =>
  api.put(`${API_POINT}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

// ❌ Supprimer un vol par ID
volsService.delete = (id, token) =>
  api.delete(`${API_POINT}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export default volsService;
