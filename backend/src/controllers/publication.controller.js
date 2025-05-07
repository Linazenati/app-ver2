// Importation des services nécessaires
const publicationService = require('../services/publication.service');
const facebookController = require('./facebook.controller');
const instagramController = require('./instagram.controller');
const siteController = require('./voyageorganise.controller')
const voyageService = require("../services/voyageorganise.service");

// Fonction pour publier un voyage sur plusieurs plateformes (site, Facebook, Instagram)
const publierMulti = async (req, res) => {
  const id = req.params.id;
  const { plateformes } = req.body; 
  const resultats = {};
console.log("Plateformes reçues :", plateformes);


  try {
    // 1. Vérifier que le voyage existe
    const voyage = await voyageService.getVoyageById(id);
    if (!voyage) {
      return res.status(404).json({ message: "Voyage non trouvé" });
    }
    


 // 2. Lancer la publication pour chaque plateforme demandée
   //site
    if (plateformes.includes("site")) {
      try {
        const siteRes = await siteController.publishToSite(req, res, true); // true = mode silencieux (pas res.json)
        resultats.site = siteRes;
      } catch (err) {
        resultats.site = { error: err.message };
      }
    }

    // Facebook
    if (plateformes.includes("facebook")) {
      try {
        const fbRes = await facebookController.publierSurFacebook(req, res, true); // true = mode silencieux (pas res.json)
        resultats.facebook = fbRes;
      } catch (err) {
        resultats.facebook = { error: err.message };
      }
    }

    // Instagram
    if (plateformes.includes("instagram")) {
      try {
        const instaRes = await instagramController.publierSurInstagram(req, res, true);
        resultats.instagram = instaRes;
      } catch (err) {
        resultats.instagram = { error: err.message };
      }
    }
    // Ajoute ici d'autres plateformes si nécessaire...

    res.status(200).json({
      message: 'Publication multiple terminée.',
      resultats
    });

  } catch (error) {
    console.error('Erreur publication multiple :', error);
    res.status(500).json({ message: 'Erreur publication multiple', error: error.message });
  }
};





// ✅ Récupérer toutes les publications avec recherche, pagination, tri et filtre par type

  const getAll = async (req, res) => {
    try {
      // Récupère les paramètres de query dans l'URL (facultatifs)
      const { search, limit, offset, orderBy, orderDir, plateforme, type } = req.query.params || {};;
      console.log("Requête reçue avec query :", req.query.params);

      const publications = await publicationService.getAll({
        search,
         plateforme,  // ⚠️ correspond bien à ce que le backend attend
         type,   
          limit,
          offset,
          orderBy,
          orderDir,
      });

      res.status(200).json(publications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


// Récupère une publication par ID
const getById = async (req, res) => {
  try {
    const pub = await publicationService.getById(req.params.id);
    if (!pub) return res.status(404).json({ message: "Publication non trouvée" });

    res.status(200).json(pub);
  } catch (error) {
    res.status(500).json({ message: "Erreur de récupération", error: error.message });
  }
};

module.exports = {
  publierMulti,
  getAll,
  getById
};
