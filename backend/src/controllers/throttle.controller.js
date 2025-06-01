const { getEtatQuota } = require('../services/throttle.service');

const afficherQuota = async(req, res) => {
  try {
    const quota = await getEtatQuota();
    console.log("📤 Réponse quota envoyée :", quota);
    res.json(quota);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = {
  afficherQuota,
};
