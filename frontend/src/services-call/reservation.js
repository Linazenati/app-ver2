import axios from 'axios';
import api from "./api";

const API_POINT = "/reservations";

const reservationService = {};

// Créer une réservation
reservationService.createReservation = (formData, config) => {
  // Utilisez axios directement pour cette requête spécifique
  return axios.post('http://localhost:3000/api/v1' + API_POINT, formData, {
    headers: {
      Authorization: config.headers.Authorization
      // Ne pas mettre Content-Type ici
    }
  });
};

// Récupérer toutes les réservations
reservationService.getAll = (token) =>
  api.get(`${API_POINT}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Récupérer une réservation par ID
reservationService.getById = (id, token) =>
  api.get(`${API_POINT}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Supprimer une réservation
reservationService.deleteReservation = (id, token) =>
  api.delete(`${API_POINT}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

reservationService.updateReservation = (id, data, token) =>
  api.put(`${API_POINT}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
export default reservationService;
