const express = require('express');
const path = require('path'); // Ajoute cette ligne pour importer le module path

const utilisateurRouter = require("./utilisateur.router");
const voyageRouter = require("./voyageorganise.router");
const facebookRouter = require("./facebook.router");
const authRouter = require("./auth.router");
const instagramRouter = require("./instagram.router");
const publicationRouter = require("./publication.router");
const omraRouter = require("./omra.router");
<<<<<<< HEAD
const reservationRouter = require("./reservation.router"); 
const webhookRouter = require("./webhook.router");
const paiementRouter = require("./paiement.router"); 
const factureRouter = require("./facture.router");
const amadeusRouter = require("./amadeus.router");
const checkToken = require("./../middlewares/authMiddleware")

module.exports = (app) => {
  app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
=======
const commentaireRouter = require("./commentaire.router");

const hotelRouter = require("./hotel.router");

module.exports = (app) => {

  app.use('/images', express.static(path.join(__dirname,  '..', 'public', 'images')));

      // 🔐 Auth (login/register)
    app.use("/api/v1/auth", authRouter);
>>>>>>> 132de8847958836ba9c8f7be64753e37240aacbc

  // 🔐 Auth (login/register)
  app.use("/api/v1/auth", authRouter);

  // 👤 Utilisateurs protégés par JWT
  app.use("/api/v1/utilisateurs",  utilisateurRouter);

  // 🧳 Voyages organisés
  app.use("/api/v1/voyages",  voyageRouter);

  // 🕋 Omra
  app.use("/api/v1/omra",  omraRouter);

  // 📘 Facebook
  app.use("/api/v1/facebook", facebookRouter);

  // 📸 Instagram
  app.use("/api/v1/instagram", instagramRouter);

  // 🧾 Paiements Chargily
  app.use("/api/v1/paiements", require('./chargily.router'));

  app.use("/api/v1/paiements1", require('./stripe.router'));

  // 📰 Publications
  app.use("/api/v1/publication", publicationRouter);

  // 📑 Réservations
  app.use("/api/v1/reservations", reservationRouter); 

  // 🧩 Webhooks (utilisé par Chargily)
app.use("/api/v1/webhook", webhookRouter);

// 💳 Paiements
app.use("/api/v1/paiements", paiementRouter);

// 📂 Factures PDF
  app.use("/api/v1/factures", factureRouter);

// 📂 API amadeus pour vols
  app.use("/api/v1/amadeus", amadeusRouter);



<<<<<<< HEAD

  // 📍 Catch all pour les routes non définies dans /api/v1
  app.use("/api/v1/", (req, res) => {
    res.json({ Error: true, msg: "Linaa Bonjour" });
  });

  // 🌍 Catch all général (hors /api/v1)
  app.use("/*", (req, res) => {
    res.json({ msg: "Hi" });
  });
};
=======
  
    // Routes pour les commentaires
    app.use("/api/v1/commentaires", commentaireRouter);
  
    // Routes pour les hotels
    app.use("/api/v1/hotel", hotelRouter);

  
      // 📍 Catch all pour les routes non définies dans /api/v1
    app.use("/api/v1/", (req, res) => {
        res.json({ Error: true, msg: "Linaa Bonjour" })
    });

    
  // 🌍 Catch all général (hors /api/v1) – utile pour SPA ou test
    app.use("/app/*", (req, res) => {
        res.json({ msg:"Hi" })
    });
}
    
>>>>>>> 132de8847958836ba9c8f7be64753e37240aacbc
