const paiementService = require('../services/paiement.service');

exports.getAllPaiements = async (req, res) => {
  try {
    const paiements = await paiementService.getAllPaiements();
    return res.status(200).json(paiements);
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements :", error);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};
