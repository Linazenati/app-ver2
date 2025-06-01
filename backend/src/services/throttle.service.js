const { Quota } = require('../models');

const LIMITE_PAR_MINUTE = 2;
const LIMITE_PAR_JOUR = 10;

// Récupère ou crée le quota du jour
const getOrCreateQuota = async () => {
  const today = new Date().toISOString().split('T')[0]; // format 'YYYY-MM-DD'
  let quota = await Quota.findOne({ where: { date: today } });

  if (!quota) {
    quota = await Quota.create({
      date: today,
      publication_minute_utilisee: 0,
      publication_jour_utilisee: 0,
      derniere_minute: new Date(0), // date très ancienne
    });
  }

  return quota;
};

// Reset la minute si > 60 secondes sans publication
const resetMinuteSiNecessaire = async (quota) => {
  const maintenant = Date.now();
  const derniereMinuteTime = new Date(quota.derniere_minute).getTime();

  if (!quota.derniere_minute || (maintenant - derniereMinuteTime) > 60000) {
    quota.publication_minute_utilisee = 0;
    quota.derniere_minute = new Date();
    await quota.save();
    console.log('♻️ Reset compteur minute');
  }
};

// Vérifie si on peut publier en tenant compte des quotas
const peutPublier = async () => {
  const quota = await getOrCreateQuota();

  await resetMinuteSiNecessaire(quota);

  if ((quota.publication_minute_utilisee || 0) >= LIMITE_PAR_MINUTE) {
    console.log("🚫 Limite par minute atteinte !");
    return false;
  }

  if ((quota.publication_jour_utilisee || 0) >= LIMITE_PAR_JOUR) {
    console.log("🚫 Limite journalière atteinte !");
    return false;
  }

  return true;
};

// Incrémente les compteurs après publication
const incrementerPublication = async () => {
  const quota = await getOrCreateQuota();

  quota.publication_minute_utilisee += 1;
  quota.publication_jour_utilisee += 1;
  quota.derniere_minute = new Date();
  await quota.save();

  console.log(`📢 Publication faite (min: ${quota.publication_minute_utilisee}, jour: ${quota.publication_jour_utilisee})`);
};

// Récupère l’état du quota sans réinitialiser autre chose que la minute si nécessaire
const getEtatQuota = async () => {
  const quota = await getOrCreateQuota();

  await resetMinuteSiNecessaire(quota);

  return {
    publicationMinuteRestante: LIMITE_PAR_MINUTE - (quota.publication_minute_utilisee || 0),
    publicationJourRestante: LIMITE_PAR_JOUR - (quota.publication_jour_utilisee || 0),
    publicationMinuteUtilisee: quota.publication_minute_utilisee || 0,
    publicationJourUtilisee: quota.publication_jour_utilisee || 0,
    LIMITE_PAR_MINUTE,
    LIMITE_PAR_JOUR,
  };
};

module.exports = {
  peutPublier,
  incrementerPublication,
  getEtatQuota,
};
