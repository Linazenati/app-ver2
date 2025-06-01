const { Quota } = require('../models');
const moment = require('moment');

const LIMITE_RECUP_PAR_MINUTE = 4;
const LIMITE_RECUP_PAR_HEURE = 10;
const LIMITE_RECUP_PAR_JOUR = 40;

const LIMITE_SUPP_PAR_MINUTE = 2;
const LIMITE_SUPP_PAR_HEURE = 10;
const LIMITE_SUPP_PAR_JOUR = 40;

const LIMITE_LIKE_PAR_MINUTE = 3;
const LIMITE_LIKE_PAR_HEURE = 15;
const LIMITE_LIKE_PAR_JOUR = 60;

let currentDate = moment().format('YYYY-MM-DD');

async function getOrCreateQuota(date) {
  let quota = await Quota.findOne({ where: { date } });
  if (!quota) {
    quota = await Quota.create({
      date,
      minute_utilisee: 0,
      heure_utilisee: 0,
      jour_utilisee: 0,
      supp_minute_utilisee: 0,
      supp_heure_utilisee: 0,
      supp_jour_utilisee: 0,
      like_minute_utilisee: 0,
      like_heure_utilisee: 0,
      like_jour_utilisee: 0,
      last_minute_reset: moment().toDate(),
      last_heure_reset: moment().toDate(),
    });
  }
  return quota;
}

// Reset général
async function resetIfNeeded() {
  const now = moment();
  const today = now.format('YYYY-MM-DD');
  if (today !== currentDate) currentDate = today;

  const quota = await getOrCreateQuota(currentDate);

  if (!quota.last_minute_reset || now.diff(moment(quota.last_minute_reset), 'minutes') >= 1) {
    quota.minute_utilisee = 0;
    quota.supp_minute_utilisee = 0;
    quota.like_minute_utilisee = 0;
    quota.last_minute_reset = now.toDate();
  }

  if (!quota.last_heure_reset || now.diff(moment(quota.last_heure_reset), 'hours') >= 1) {
    quota.heure_utilisee = 0;
    quota.supp_heure_utilisee = 0;
    quota.like_heure_utilisee = 0;
    quota.last_heure_reset = now.toDate();
  }

  if (quota.date !== today) {
    quota.jour_utilisee = 0;
    quota.supp_jour_utilisee = 0;
    quota.like_jour_utilisee = 0;
    quota.date = today;
  }

  await quota.save();
}

// 📊 État récupération
async function getEtatRecupQuota() {
  await resetIfNeeded();
  const quota = await getOrCreateQuota(currentDate);

  let recupMinuteRestante = LIMITE_RECUP_PAR_MINUTE - quota.minute_utilisee;
  let recupHeureRestante = LIMITE_RECUP_PAR_HEURE - quota.heure_utilisee;
  let recupJourRestante = LIMITE_RECUP_PAR_JOUR - quota.jour_utilisee;

  if (recupJourRestante <= 0) {
    recupHeureRestante = 0;
    recupMinuteRestante = 0;
  } else if (recupHeureRestante <= 0) {
    recupMinuteRestante = 0;
  }

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

// 📊 État suppression
async function getEtatSuppQuota() {
  await resetIfNeeded();
  const quota = await getOrCreateQuota(currentDate);

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

// 📊 État likes
async function getEtatLikeQuota() {
  await resetIfNeeded();
  const quota = await getOrCreateQuota(currentDate);

  let likeMinuteRestante = LIMITE_LIKE_PAR_MINUTE - quota.like_minute_utilisee;
  let likeHeureRestante = LIMITE_LIKE_PAR_HEURE - quota.like_heure_utilisee;
  let likeJourRestante = LIMITE_LIKE_PAR_JOUR - quota.like_jour_utilisee;

  if (likeJourRestante <= 0) {
    likeHeureRestante = 0;
    likeMinuteRestante = 0;
  } else if (likeHeureRestante <= 0) {
    likeMinuteRestante = 0;
  }

  return {
    likeMinuteRestante,
    likeHeureRestante,
    likeJourRestante,
    likeMinuteUtilisee: quota.like_minute_utilisee,
    likeHeureUtilisee: quota.like_heure_utilisee,
    likeJourUtilisee: quota.like_jour_utilisee,
    LIMITE_LIKE_PAR_MINUTE,
    LIMITE_LIKE_PAR_HEURE,
    LIMITE_LIKE_PAR_JOUR,
  };
}

// 🔼 Incrément récupération
async function incrementerQuota() {
  await resetIfNeeded();
  const quota = await getOrCreateQuota(currentDate);

  if (
    quota.minute_utilisee >= LIMITE_RECUP_PAR_MINUTE ||
    quota.heure_utilisee >= LIMITE_RECUP_PAR_HEURE ||
    quota.jour_utilisee >= LIMITE_RECUP_PAR_JOUR
  ) throw new Error('Quota récupération dépassé');

  quota.minute_utilisee++;
  quota.heure_utilisee++;
  quota.jour_utilisee++;
  await quota.save();
}

// 🔼 Incrément suppression
async function incrementerSuppQuota() {
  await resetIfNeeded();
  const quota = await getOrCreateQuota(currentDate);

  if (
    quota.supp_minute_utilisee >= LIMITE_SUPP_PAR_MINUTE ||
    quota.supp_heure_utilisee >= LIMITE_SUPP_PAR_HEURE ||
    quota.supp_jour_utilisee >= LIMITE_SUPP_PAR_JOUR
  ) throw new Error('Quota suppression dépassé');

  quota.supp_minute_utilisee++;
  quota.supp_heure_utilisee++;
  quota.supp_jour_utilisee++;
  await quota.save();
}

// 🔼 Incrément likes
async function incrementerLikeQuota() {
  await resetIfNeeded();
  const quota = await getOrCreateQuota(currentDate);

  if (
    quota.like_minute_utilisee >= LIMITE_LIKE_PAR_MINUTE ||
    quota.like_heure_utilisee >= LIMITE_LIKE_PAR_HEURE ||
    quota.like_jour_utilisee >= LIMITE_LIKE_PAR_JOUR
  ) throw new Error('Quota likes dépassé');

  quota.like_minute_utilisee++;
  quota.like_heure_utilisee++;
  quota.like_jour_utilisee++;
  await quota.save();
}

module.exports = {
  getEtatRecupQuota,
  incrementerQuota,
  getEtatSuppQuota,
  incrementerSuppQuota,
  getEtatLikeQuota,
  incrementerLikeQuota
};
