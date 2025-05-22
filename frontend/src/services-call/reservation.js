import api from "./api";

const API_POINT = "/reservations";

const reservationService = {};

// Créer une réservation
reservationService.createReservation = (data, token) =>
  api.post(`${API_POINT}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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
