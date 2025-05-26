// Importation des services nécessaires
const publicationService = require('../services/publication.service');
const facebookController = require('./facebook.controller');
const instagramController = require('./instagram.controller');
const siteController = require('./voyageorganise.controller')
const voyageService = require("../services/voyageorganise.service");

// Fonction pour publier un voyage sur plusieurs plateformes (site, Facebook, Instagram)
const publierMulti = async (req, res) => {
  const id = req.params.id;
  if (!id) {
  return res.status(400).json({ message: "ID du voyage manquant dans l'URL" });
}
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
        const siteRes = await siteController.publishToSite(voyage.id); // true = mode silencieux (pas res.json)
        resultats.site = siteRes;
      } catch (err) {
        resultats.site = { error: err.message };
      }
    }

    // Facebook
    if (plateformes.includes("facebook")) {
      try {
        const fbRes = await facebookController.publierSurFacebook(voyage.id); // true = mode silencieux (pas res.json)
        resultats.facebook = fbRes;
      } catch (err) {
        resultats.facebook = { error: err.message };
      }
    }

    // Instagram
    if (plateformes.includes("instagram")) {
      try {
        const instaRes = await instagramController.publierSurInstagram(voyage.id);
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

  } catch (err) {
    console.error('Erreur publication multiple :', err.message);
    res.status(500).json({ message: 'Erreur publication multiple', error:err.message });
  }
};





// ✅ Récupérer toutes les publications avec recherche, pagination, tri et filtre par type

  const getAll = async (req, res) => {
  try {
    const publications = await publicationService.getAll();
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

// ✅ Récupère les publications d’une Omra
const getByIdOmra = async (req, res) => {
  try {
    const { id_omra } = req.params;
    const pub = await publicationService.getByIdOmra(id_omra);
    if (!pub) return res.status(404).json({ message: "Publication non trouvée" });

    res.status(200).json(pub);
  } catch (error) {
    res.status(500).json({ message: "Erreur de récupération", error: error.message });
  }
};



// ✅ Récupérer les publications d'un voyage publié par ID
const getPublicationsByVoyageId = async (req, res) => {
  const voyageId = req.params.id;
  
  try {
    // Vérifie que le voyage est publié
    const voyage = await voyageService.getVoyageById(voyageId);
    if (!voyage || !voyage.est_publier) {
      return res.status(404).json({ message: "Voyage non trouvé ou non publié" });
    }

    // Récupère les publications liées à ce voyage
    const publications = await publicationService.getPublicationsByVoyageId(voyageId);
    res.status(200).json(publications);
    
  } catch (error) {
    console.error('Erreur récupération des publications :', error.message);
    res.status(500).json({ message: 'Erreur lors de la récupération des publications', error: error.message });
  }
};
module.exports = {
  publierMulti,
  getAll,
  getById,
  getByIdOmra,
  getPublicationsByVoyageId
};
