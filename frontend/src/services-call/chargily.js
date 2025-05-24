import api from "./api"; // Ton instance Axios personnalisée

const API_POINT = "/paiements"; // Le point de base de ton backend, ajuste-le si nécessaire

const chargilyService = {};

// Créer un lien de paiement
chargilyService.initiatePayment = (paymentData, token) =>
  api.post(`${API_POINT}/initier`, paymentData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export default chargilyService;
