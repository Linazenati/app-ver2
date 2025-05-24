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

  if (!id || !type) {
    return res.status(400).json({ message: "ID ou type de publication manquant." });
  }

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
        const siteRes = type === "voyage"
          ? await siteController.publishToSite(id, true)
          : await siteController1.publishToSite(req, res, true); // vrai = appel silencieux
        resultats.site = siteRes;
      } catch (err) {
        resultats.site = { error: err.message };
      }
    }

    if (plateformes.includes("facebook")) {
      try {
        const fbRes = await facebookController.publierSurFacebook(id, true);
        resultats.facebook = fbRes;
      } catch (err) {
        resultats.facebook = { error: err.message };
      }
    }

    if (plateformes.includes("instagram")) {
      try {
        const instaRes = await instagramController.publierSurInstagram(id);
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


// ✅ Récupérer toutes les publications
const getAll = async (req, res) => {
  try {
    const publications = await publicationService.getAll();
    res.status(200).json(publications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Récupère une publication par ID
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

// ✅ Récupère les publications d’un voyage publié
const getPublicationsByVoyageId = async (req, res) => {
  const voyageId = req.params.id;

  try {
    const voyage = await voyageService.getVoyageById(voyageId);
    if (!voyage || !voyage.est_publier) {
      return res.status(404).json({ message: "Voyage non trouvé ou non publié" });
    }

    const publications = await publicationService.getPublicationsByVoyageId(voyageId);
    res.status(200).json(publications);

  } catch (error) {
    console.error('Erreur récupération des publications :', error.message);
    res.status(500).json({ message: 'Erreur lors de la récupération des publications', error: error.message });
  }
};

export {
  publierMulti,
  getAll,
  getById,
  getByIdOmra,
  getPublicationsByVoyageId
};
