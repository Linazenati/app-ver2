// Importation des services nécessaires
import publicationService from '../services/publication.service.js';
import facebookController from './facebook.controller.js';
import instagramController from './instagram.controller.js';
import siteController from './voyageorganise.controller.js';
import siteController1 from './omra.controller.js';


import voyageService from "../services/voyageorganise.service.js";
import omraService from '../services/omra.service.js';


// Fonction pour publier un voyage sur plusieurs plateformes (site, Facebook, Instagram)
const publierMulti = async (req, res) => {
  const id = req.params.id;
<<<<<<< HEAD
  const { plateformes, type } = req.body;
=======
  if (!id) {
  return res.status(400).json({ message: "ID du voyage manquant dans l'URL" });
}
  const { plateformes } = req.body; 
>>>>>>> 132de8847958836ba9c8f7be64753e37240aacbc
  const resultats = {};

  try {
    let item;
    if (type === "voyage") {
      item = await voyageService.getVoyageById(id);
    } else if (type === "omra") {
      item = await omraService.getOmraById(id);
    } else {
      return res.status(400).json({ message: "Type de publication invalide." });
    }

    if (!item) {
      return res.status(404).json({ message: `${type} non trouvé(e)` });
    }

    // Lancer les publications
    if (plateformes.includes("site")) {
      try {
<<<<<<< HEAD
        const siteRes = await siteController1.publishToSite(req, res, true);  // Appel silencieux
=======
        const siteRes = await siteController.publishToSite(voyage.id); // true = mode silencieux (pas res.json)
>>>>>>> 132de8847958836ba9c8f7be64753e37240aacbc
        resultats.site = siteRes;
      } catch (err) {
        resultats.site = { error: err.message };
      }
    }

    if (plateformes.includes("facebook")) {
      try {
<<<<<<< HEAD
        const fbRes = await facebookController.publierSurFacebook(req, res, true);
=======
        const fbRes = await facebookController.publierSurFacebook(voyage.id); // true = mode silencieux (pas res.json)
>>>>>>> 132de8847958836ba9c8f7be64753e37240aacbc
        resultats.facebook = fbRes;
      } catch (err) {
        resultats.facebook = { error: err.message };
      }
    }

    if (plateformes.includes("instagram")) {
      try {
        const instaRes = await instagramController.publierSurInstagram(voyage.id);
        resultats.instagram = instaRes;
      } catch (err) {
        resultats.instagram = { error: err.message };
      }
    }

    res.status(200).json({
      message: `Publication multiple de ${type} terminée.`,
      resultats
    });

<<<<<<< HEAD
  } catch (error) {
    console.error(`Erreur publication multiple ${type} :`, error);
    res.status(500).json({ message: `Erreur publication ${type}`, error: error.message });
=======
  } catch (err) {
    console.error('Erreur publication multiple :', err.message);
    res.status(500).json({ message: 'Erreur publication multiple', error:err.message });
>>>>>>> 132de8847958836ba9c8f7be64753e37240aacbc
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

<<<<<<< HEAD
// Récupère une publication par ID
const getByIdOmra = async (req, res) => {
  try {
    const {id_omra} = req.params;

    const pub = await publicationService.getByIdOmra(id_omra);
    if (!pub) return res.status(404).json({ message: "Publication non trouvée" });

    res.status(200).json(pub);
  } catch (error) {
    res.status(500).json({ message: "Erreur de récupération", error: error.message });
  }
};

export {
  publierMulti,
  getAll,
  getById,
  getByIdOmra
=======

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
  getPublicationsByVoyageId
>>>>>>> 132de8847958836ba9c8f7be64753e37240aacbc
};
