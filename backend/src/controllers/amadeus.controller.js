const amadeusService = require('../services/amadeus.service');

async function rechercherVols(req, res) {
  // On récupère les paramètres depuis req.body (ou req.query selon ce que tu préfères)
  const {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    adults,
    nonStop,
    max,
    travelClass
  } = req.body;

  try {
    // Appel au service pour récupérer les offres de vols
    const resultats = await amadeusService.rechercherVols({
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults,
      nonStop,
      max,
      travelClass
    });

    // Réponse JSON complète avec toutes les données reçues
    res.json(resultats);
  } catch (error) {
    console.error("Erreur dans le contrôleur Amadeus:", error.response?.data || error.message || error);

    res.status(500).json({
      message: 'Erreur lors de la recherche de vols',
      details: error.response?.data || error.message || 'Erreur inconnue'
    });
  }
}

module.exports = {
  rechercherVols
};
