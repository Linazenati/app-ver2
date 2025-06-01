const quotaService = require('../services/recuperationQuota.service');

async function getQuota(req, res) {
  try {
    const quota = await quotaService.getEtatRecupQuota();
    res.json(quota);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function recuperer(req, res) {
  try {
    // Avant de récupérer les commentaires par ex, on incrémente le quota
    await quotaService.incrementerQuota();
 const quota = await quotaService.getEtatRecupQuota(); // on récupère les quotas après l’incrément
    console.log("🔄 Quota mis à jour (après récupération) :", quota);

    res.json({
      message: 'Récupération réussie, quota mis à jour.',
      quotaActuel: quota // 👈 on renvoie les quotas au front !
    });
  } catch (error) {
    res.status(429).json({ message: error.message });
  }
}


async function getEtatQuotaSupp(req, res) {
  try {
    const etat = await quotaService.getEtatSuppQuota();
    res.status(200).json(etat);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du quota de suppression', error: error.message });
  }
};
async function incrementerQuotaSupp(req, res) {
  try {
    await quotaService.incrementerSuppQuota();
    res.status(200).json({ message: 'Quota de suppression incrémenté avec succès' });
  } catch (error) {
    res.status(429).json({ message: 'Quota de suppression dépassé', error: error.message });
  }
};

module.exports = { getQuota, recuperer,getEtatQuotaSupp , incrementerQuotaSupp };
