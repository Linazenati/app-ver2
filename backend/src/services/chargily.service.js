const axios = require('axios');
const { CHARGILY_SECRET_KEY, CHARGILY_API_BASE_URL } = require('../config/chargily.config');

exports.createPaymentLink = async (paymentData) => {
  try {
    const response = await axios.post(
      `${CHARGILY_API_BASE_URL}/checkouts`,
      paymentData,
      {
        headers: {
          Authorization: CHARGILY_SECRET_KEY,
          'Content-Type': 'application/json'
        }
      }
    ); 

    return response;
  } catch (error) {
    console.error("Erreur lors de la création du lien de paiement Chargily :", error.response?.data || error.message);
    throw error;
  }
};
