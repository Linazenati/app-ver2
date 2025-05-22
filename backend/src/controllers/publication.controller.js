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
  const { plateformes, type } = req.body;
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
        const siteRes = await siteController1.publishToSite(req, res, true);  // Appel silencieux
        resultats.site = siteRes;
      } catch (err) {
        resultats.site = { error: err.message };
      }
    }

    if (plateformes.includes("facebook")) {
      try {
        const fbRes = await facebookController.publierSurFacebook(req, res, true);
        resultats.facebook = fbRes;
      } catch (err) {
        resultats.facebook = { error: err.message };
      }
    }

    if (plateformes.includes("instagram")) {
      try {
        const instaRes = await instagramController.publierSurInstagram(req, res, true);
        resultats.instagram = instaRes;
      } catch (err) {
        resultats.instagram = { error: err.message };
      }
    }

    res.status(200).json({
      message: `Publication multiple de ${type} terminée.`,
      resultats
    });

  } catch (error) {
    console.error(`Erreur publication multiple ${type} :`, error);
    res.status(500).json({ message: `Erreur publication ${type}`, error: error.message });
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
};
