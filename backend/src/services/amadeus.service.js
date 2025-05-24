const amadeus = require('../config/amadeus.config');

async function rechercherVols({
  originLocationCode,
  destinationLocationCode,
  departureDate,
  returnDate,
  adults,
  nonStop,
  max,
  travelClass
}) {
  try {
    // Appel à l'API Amadeus avec les paramètres fournis
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate, // facultatif
      adults: Number(adults),
      nonStop: nonStop ?? true,
      max: max ?? 50, // tu peux changer cette valeur pour plus de résultats si besoin
      travelClass: travelClass ?? 'ECONOMY'
    });

    // Retourner la réponse complète, y compris tous les paramètres (array, price, itinéraires, segments...)
    return response.data;
  } catch (error) {
    console.error('Erreur dans le service Amadeus:', error.response?.data || error.message || error);
    throw error;
  }
}

module.exports = {
  rechercherVols
};
