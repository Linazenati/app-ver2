// Importation des services nécessaires
const publicationService = require('../services/publication.service');
const facebookController = require('./facebook.controller');
const instagramController = require('./instagram.controller');
const siteController = require('./voyageorganise.controller')
const voyageService = require("../services/voyageorganise.service");
const omraService = require("../services/omra.service")
const siteOmraController = require("./omra.controller")

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
    

     // 🚫 Vérifier la date de départ
    const maintenant = new Date();
    const dateDepart = new Date(voyage.date_depart); // adapte selon ton champ
    if (dateDepart < maintenant) {
      return res.status(400).json({
        message: "Impossible de publier : la date de départ est déjà passée.",
        resultats: {
          site: { error: "La date de départ est déjà passée." },
          facebook: { error: "La date de départ est déjà passée." },
          instagram: { error: "La date de départ est déjà passée." },
        }
      });

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
    console.log("Plateformes demandées :", plateformes);

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


const publierMultiOmra = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "ID de l'Omra manquant dans l'URL" });
  }

  const { plateformes } = req.body;
  const resultats = {};

  try {
    const omra = await omraService.getOmraById(id);
    if (!omra) {
      return res.status(404).json({ message: "Omra non trouvée" });
    }

    // Site
    if (plateformes.includes("site")) {
      try {
        const siteRes = await siteOmraController.publishToSite(omra.id);
        resultats.site = siteRes;
      } catch (err) {
        resultats.site = { error: err.message };
      }
    }

    // Facebook
    if (plateformes.includes("facebook")) {
      try {
        const fbRes = await facebookController.publierOmraSurFacebook(omra.id);
        resultats.facebook = fbRes;
      } catch (err) {
        resultats.facebook = { error: err.message };
      }
    }

    // Instagram
    if (plateformes.includes("instagram")) {
      try {
        const instaRes = await instagramController.publierSurInstagramOmra(omra.id);

        resultats.instagram = instaRes;
      } catch (err) {
        resultats.instagram = { error: err.message };
      }
    }
    // Ajoute ici d'autres plateformes si nécessaire...

    res.status(200).json({
      message: "Publication multiple terminée pour Omra.",
      resultats,
    });

  } catch (err) {
    console.error("Erreur publication Omra :", err.message);
    res.status(500).json({ message: "Erreur publication Omra", error: err.message });
    
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


// ✅ Récupérer les publications d'une Omra publiée par ID
const getPublicationsByOmraId = async (req, res) => {
  const omraId = req.params.id;

  try {
    // Vérifie que l'Omra est publiée
    const omra = await omraService.getOmraById(omraId);
    if (!omra || !omra.est_publier) {
      return res.status(404).json({ message: "Omra non trouvée ou non publiée" });
    }

    // Récupère les publications liées à cette Omra
    const publications = await publicationService.getPublicationsByOmraId(omraId);
    res.status(200).json(publications);
    
  } catch (error) {
    console.error('Erreur récupération des publications Omra :', error.message);
    res.status(500).json({ message: 'Erreur lors de la récupération des publications', error: error.message });
  }
};




const getLikesByPostId = async (req, res) => {
  try {
    const { plateforme, id_post } = req.query;
    console.log('Requête getLikesByPostId, params:', req.query);

    if (!plateforme || !id_post) {
      return res.status(400).json({ message: 'Paramètres manquants : plateforme ou id_post' });
    }

    const likes = await publicationService.getLikesBase(plateforme, id_post);

    if (likes === null) {
      return res.status(404).json({ message: 'Publication non trouvée' });
    }

    return res.json({ postId: id_post, likes });

  } catch (error) {
    console.error('❌ Erreur serveur lors de la récupération des likes:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};




module.exports = {
  publierMulti,
  getAll,
  getById,
  getPublicationsByVoyageId,
  publierMultiOmra,
  getPublicationsByOmraId,
  getLikesByPostId
};
