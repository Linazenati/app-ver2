import api from "./api"; // Ton instance Axios personnalisée

const API_POINT = "/paiements1"; // Le point de base de l'API Stripe dans ton backend

const stripeService = {};

// Créer un lien de paiement Stripe Checkout
stripeService.initiatePayment = (paymentData, token) =>
  api.post(`${API_POINT}/initier`, paymentData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });


export default stripeService;
