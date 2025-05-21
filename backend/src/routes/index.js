const express = require('express');
const path = require('path'); // Ajoute cette ligne pour importer le module path
const utilisateurRouter = require("./utilisateur.router");
const voyageRouter = require("./voyageorganise.router");
const facebookRouter = require("./facebook.router");
const authRouter = require("./auth.router");
const instagramRouter = require("./instagram.router");
const publicationRouter = require ("./publication.router")
const omraRouter = require("./omra.router");
const commentaireRouter = require("./commentaire.router");

const hotelRouter = require("./hotel.router");

module.exports = (app) => {

  app.use('/images', express.static(path.join(__dirname,  '..', 'public', 'images')));

      // 🔐 Auth (login/register)
    app.use("/api/v1/auth", authRouter);

      // 👤 Utilisateurs protégés par JWT
    app.use("/api/v1/utilisateurs", utilisateurRouter);
  
  
    // 🧳 Voyages organisés (accessibles sans token pour l’instant)
    app.use("/api/v1/voyages", voyageRouter);

   // Omra
    app.use("/api/v1/omra", omraRouter);

     // Routes pour Facebook
    app.use("/api/v1/facebook", facebookRouter); 
  
      // Routes pour Instagram
    app.use("/api/v1/instagram", instagramRouter); 

   


  // Routes pour publications
    app.use("/api/v1/publication", publicationRouter);

  
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
    
