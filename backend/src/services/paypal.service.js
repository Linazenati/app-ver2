const axios = require('axios');
const qs = require('qs');
const { PAYPAL_CLIENT_ID, PAYPAL_SECRET, PAYPAL_API } = require('../config/paypal.config');


async function getAccessToken() {
  const response = await axios.post(
    `${PAYPAL_API}/v1/oauth2/token`,               // URL vers l'API d'auth PayPal
      qs.stringify({ grant_type: 'client_credentials' }),  // corps de la requête
   
      {
      auth: {
        username: PAYPAL_CLIENT_ID,     // ID de ton appli PayPal
        password: PAYPAL_SECRET,        // Clé secrète PayPal
          },
          

      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
          },
      
    }
  );

  return response.data.access_token;   // Renvoie le token d'accès
}
