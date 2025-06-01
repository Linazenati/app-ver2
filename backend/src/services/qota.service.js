const { Quota } = require('../models');
const moment = require('moment');

const LIMITE_RECUP_PAR_MINUTE = 4;
const LIMITE_RECUP_PAR_HEURE = 10;
const LIMITE_RECUP_PAR_JOUR = 40;


// Pour tracker le dernier reset en mémoire
let lastMinuteReset = moment();
let lastHeureReset = moment();
let currentDate = moment().format('YYYY-MM-DD');

/**
 * Fonction qui reset les compteurs en base si nécessaire (minute, heure, jour)
 */
async function resetIfNeeded() {
  const now = moment();
  const today = now.format('YYYY-MM-DD');

  // Reset journalier si on change de jour
  if (today !== currentDate) {
    currentDate = today;
    lastMinuteReset = now;
    lastHeureReset = now;

    // Remet à zéro les compteurs journaliers en base
    await Quota.upsert({
      date: currentDate,
      minute_utilisee: 0,
      heure_utilisee: 0,
      jour_utilisee: 0,
    });
    return;
  }

  // Charge quota courant
  let quota = await Quota.findOne({ where: { date: currentDate } });
  if (!quota) {
    // Si pas trouvé, création avec compteurs à 0
    quota = await Quota.create({
      date: currentDate,
      minute_utilisee: 0,
      heure_utilisee: 0,
      jour_utilisee: 0,
    });
  }

  // Reset minute si écoulée 1 minute depuis dernier reset minute
  if (now.diff(lastMinuteReset, 'minutes') >= 1) {
    quota.minute_utilisee = 0;
    await quota.save();
    lastMinuteReset = now;
  }

  // Reset heure si écoulée 1 heure depuis dernier reset heure
  if (now.diff(lastHeureReset, 'hours') >= 1) {
    quota.heure_utilisee = 0;
    await quota.save();
    lastHeureReset = now;
  }
}

/**
 * Récupère l'état actuel des quotas (valeurs restantes et utilisées)
 */
async function getEtatRecupQuota() {
  await resetIfNeeded();

  const quota = await Quota.findOne({ where: { date: currentDate } });
console.log('Valeurs en base:', quota.minute_utilisee, quota.heure_utilisee, quota.jour_utilisee);

  if (!quota) {
    // Crée un quota si pas trouvé (sécurité)
    quota = await Quota.create({
      date: currentDate,
      minute_utilisee: 0,
      heure_utilisee: 0,
      jour_utilisee: 0,
    });
  }

  // ✅ D'abord on calcule les valeurs restantes
  let recupMinuteRestante = LIMITE_RECUP_PAR_MINUTE - quota.minute_utilisee;
  let recupHeureRestante = LIMITE_RECUP_PAR_HEURE - quota.heure_utilisee;
  let recupJourRestante = LIMITE_RECUP_PAR_JOUR - quota.jour_utilisee;

  // ✅ Ensuite on applique la cohérence logique
  if (recupJourRestante <= 0) {
    recupHeureRestante = 0;
    recupMinuteRestante = 0;
  } else if (recupHeureRestante <= 0) {
    recupMinuteRestante = 0;
  }

  // ✅ Et enfin on retourne les infos
  return {
    recupMinuteRestante,
    recupHeureRestante,
    recupJourRestante,
    minuteUtilisee: quota.minute_utilisee,
    heureUtilisee: quota.heure_utilisee,
    jourUtilisee: quota.jour_utilisee,
    LIMITE_RECUP_PAR_MINUTE,
    LIMITE_RECUP_PAR_HEURE,
    LIMITE_RECUP_PAR_JOUR,
  };
}

/**
 * Incrémente les compteurs de quota dans la base
 */
async function incrementerQuota() {
  await resetIfNeeded();

  let quota = await Quota.findOne({ where: { date: currentDate } });
  if (!quota) {
    quota = await Quota.create({
      date: currentDate,
      minute_utilisee: 0,
      heure_utilisee: 0,
      jour_utilisee: 0,
    });
  }

  console.log('Avant incrément :', quota.minute_utilisee, quota.heure_utilisee, quota.jour_utilisee);

  if (
    quota.minute_utilisee >= LIMITE_RECUP_PAR_MINUTE ||
    quota.heure_utilisee >= LIMITE_RECUP_PAR_HEURE ||
    quota.jour_utilisee >= LIMITE_RECUP_PAR_JOUR
  ) {
    throw new Error('Quota dépassé, récupération impossible');
  }

  // Incrément
  quota.minute_utilisee++;
  quota.heure_utilisee++;
  quota.jour_utilisee++;

  console.log('Après incrément :', quota.minute_utilisee, quota.heure_utilisee, quota.jour_utilisee);

  await quota.save();

  console.log('Après save en base');
}




const LIMITE_SUPP_PAR_MINUTE = 2;
const LIMITE_SUPP_PAR_HEURE = 10;
const LIMITE_SUPP_PAR_JOUR = 40;



async function resetSuppIfNeeded() {
  const now = moment();
  const today = now.format('YYYY-MM-DD');

  if (today !== currentDate) {
    currentDate = today;
    lastMinuteReset = now;
    lastHeureReset = now;

    await Quota.upsert({
      date: currentDate,
      supp_minute_utilisee: 0,
      supp_heure_utilisee: 0,
      supp_jour_utilisee: 0,
    });
    return;
  }

  let quota = await Quota.findOne({ where: { date: currentDate } });
  if (!quota) {
    quota = await Quota.create({
      date: currentDate,
      supp_minute_utilisee: 0,
      supp_heure_utilisee: 0,
      supp_jour_utilisee: 0,
    });
  }

  if (now.diff(lastMinuteReset, 'minutes') >= 1) {
    quota.supp_minute_utilisee = 0;
    await quota.save();
    lastMinuteReset = now;
  }

  if (now.diff(lastHeureReset, 'hours') >= 1) {
    quota.supp_heure_utilisee = 0;
    await quota.save();
    lastHeureReset = now;
  }
}

async function getEtatSuppQuota() {
  await resetSuppIfNeeded();

  let quota = await Quota.findOne({ where: { date: currentDate } });

  if (!quota) {
    quota = await Quota.create({
      date: currentDate,
      supp_minute_utilisee: 0,
      supp_heure_utilisee: 0,
      supp_jour_utilisee: 0,
    });
  }

  let suppMinuteRestante = LIMITE_SUPP_PAR_MINUTE - quota.supp_minute_utilisee;
  let suppHeureRestante = LIMITE_SUPP_PAR_HEURE - quota.supp_heure_utilisee;
  let suppJourRestante = LIMITE_SUPP_PAR_JOUR - quota.supp_jour_utilisee;

  if (suppJourRestante <= 0) {
    suppHeureRestante = 0;
    suppMinuteRestante = 0;
  } else if (suppHeureRestante <= 0) {
    suppMinuteRestante = 0;
  }

  return {
    suppMinuteRestante,
    suppHeureRestante,
    suppJourRestante,
    suppMinuteUtilisee: quota.supp_minute_utilisee,
    suppHeureUtilisee: quota.supp_heure_utilisee,
    suppJourUtilisee: quota.supp_jour_utilisee,
    LIMITE_SUPP_PAR_MINUTE,
    LIMITE_SUPP_PAR_HEURE,
    LIMITE_SUPP_PAR_JOUR,
  };
}

async function incrementerSuppQuota() {
  await resetSuppIfNeeded();

  let quota = await Quota.findOne({ where: { date: currentDate } });
  if (!quota) {
    quota = await Quota.create({
      date: currentDate,
      supp_minute_utilisee: 0,
      supp_heure_utilisee: 0,
      supp_jour_utilisee: 0,
    });
  }

  if (
    quota.supp_minute_utilisee >= LIMITE_SUPP_PAR_MINUTE ||
    quota.supp_heure_utilisee >= LIMITE_SUPP_PAR_HEURE ||
    quota.supp_jour_utilisee >= LIMITE_SUPP_PAR_JOUR
  ) {
    throw new Error('Quota de suppression dépassé');
  }

  quota.supp_minute_utilisee++;
  quota.supp_heure_utilisee++;
  quota.supp_jour_utilisee++;

  await quota.save();
}




const LIMITE_LIKE_PAR_MINUTE = 3;
const LIMITE_LIKE_PAR_HEURE = 15;
const LIMITE_LIKE_PAR_JOUR = 50;



module.exports = { getEtatRecupQuota, incrementerQuota , getEtatSuppQuota  , incrementerSuppQuota};
