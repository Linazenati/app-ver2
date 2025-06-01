const express = require('express');
const path = require('path');

const utilisateurRouter = require("./utilisateur.router");
const voyageRouter = require("./voyageorganise.router");
const facebookRouter = require("./facebook.router");
const quotaRouter = require ("./throttle.router")
const authRouter = require("./auth.router");
const instagramRouter = require("./instagram.router");
const publicationRouter = require("./publication.router");
const omraRouter = require("./omra.router");
const reservationRouter = require("./reservation.router"); 
const webhookRouter = require("./webhook.router");
const paiementRouter = require("./paiement.router"); 
const factureRouter = require("./facture.router");
const amadeusRouter = require("./amadeus.router");
const commentaireRouter = require("./commentaire.router");
const hotelRouter = require("./hotel.router");
const visaRouter = require("./visa.router");
const volRouter = require("./vols.router");
const assuranceRouter = require("./assurance.router");
const apiconfigRouter = require("./apiconfig.router");

module.exports = (app) => {
  // 📂 Fichiers statiques (images)
  app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));

  // 🔐 Auth (login/register)
  app.use("/api/v1/auth", authRouter);

  // 👤 Utilisateurs
  app.use("/api/v1/utilisateurs", utilisateurRouter);

  // 🧳 Voyages organisés
  app.use("/api/v1/voyages", voyageRouter);

  // 🕋 Omra
  app.use("/api/v1/omra", omraRouter);

  // 📰 Publications
  app.use("/api/v1/publication", publicationRouter);

  // 📘 Facebook
  app.use("/api/v1/facebook", facebookRouter);

  // 📸 Instagram
  app.use("/api/v1/instagram", instagramRouter);

  //Qouta 
    app.use("/api/v1/quota", quotaRouter);

  
  //visa 
    app.use("/api/v1/visa", visaRouter);


  // 💳 Paiements
  app.use("/api/v1/paiements", paiementRouter);
  // 🧾 Paiements Chargily
  app.use("/api/v1/paiements", require('./chargily.router'));
//stripe
  app.use("/api/v1/paiements1", require('./stripe.router'));

  // 📑 Réservations
  app.use("/api/v1/reservations", reservationRouter);

  // 🧩 Webhooks
  app.use("/api/v1/webhook", webhookRouter);

  // 📂 Factures
  app.use("/api/v1/factures", factureRouter);

  // ✈️ API Amadeus
  app.use("/api/v1/amadeus", amadeusRouter);

  // 💬 Commentaires
  app.use("/api/v1/commentaires", commentaireRouter);

  // 🏨 Hôtels
  app.use("/api/v1/hotel", hotelRouter);

// ✈️ vols
  app.use("/api/v1/vol", volRouter);

  // 📑 Assurance
  app.use("/api/v1/assurances", assuranceRouter);

  app.use("/api/v1/config-apis", apiconfigRouter);

  // 🧭 Catch-all pour les routes non définies dans /api/v1
  app.use("/api/v1/", (req, res) => {
    res.status(404).json({ error: true, msg: "Route API non trouvée" });
  });

  // 🌍 Catch-all général (hors /api/v1) – utile pour SPA
  app.use("/*", (req, res) => {
    res.status(404).json({ msg: "Ressource non trouvée" });
  });
};
