const omraService = require("../services/omra.service");
const { Omra } = require('../models');
const publicationService = require('../services/publication.service');

// ✅ Créer une Omra
const create = async (req, res) => {
  try {
    const { titre, description, prix,  date_de_depart, statut ,} = req.body;
    const image = req.file ? req.file.filename : null;
    console.log("req.file", req.file);
if (!req.file) {
  return res.status(400).json({ message: "Aucune image reçue ou format invalide" });
}
console.log("BODY:", req.body);
 
    const omra = await Omra.create({
      titre,
      prix,
      date_de_depart,
      description,
      image,
      id_agent: 20,
       statut 
    });

    res.status(201).json(omra);
  } catch (err) {
    console.error("Erreur complète :", err);
    res.status(500).json({ message: "Erreur lors de la création", error: err.message });
  }
  
};

// ✅ Récupérer toutes les Omras
const getAll = async (req, res) => {
  try {
    const { search, limit, offset, orderBy, orderDir, plateforme, est_publier, annee_de_depart, mois_de_depart } = req.query;

    // Validation
    if (plateforme && est_publier !== 'true') {
      return res.status(400).json({
        success: false,
        message: "Le filtre plateforme nécessite est_publier=true"
      });
    }

    const result = await omraService.getAllOmras({
      search,
      limit,
      offset,
      orderBy,
      orderDir,
      plateforme,
      est_publier,
      annee_de_depart,
      mois_de_depart
    });

    // Nettoyage des données si est_publier=false
    const cleanedData = est_publier === 'true' 
      ? result.rows 
      : result.rows.map(v => {
          const { publications, ...rest } = v.get({ plain: true });
          return rest;
        });

    res.json({
      success: true,
      total: result.count,
      data: cleanedData
    });

  } catch (error) {
    console.error('Erreur contrôleur:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};


// ✅ Récupérer une Omra par ID
const getById = async (req, res) => {
  try {
    const omra = await omraService.getOmraById(req.params.id);

    if (!omra) {
      return res.status(404).json({ message: "Omra non trouvée" });
    }

    res.status(200).json(omra);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
  }
};

// ✅ Mettre à jour une Omra
const update = async (req, res) => {
          console.log("ID reçu pour update :", req.params.id); // AJOUTE CECI
  try {
    const updatedOmra = await omraService.updateOmra(req.params.id, req.body);
    res.status(200).json(updatedOmra);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
};

// ✅ Supprimer une Omra
const deletee = async (req, res) => {
   console.log("ID reçu pour delete :", req.params.id); // AJOUTE CECI
  try {
    await omraService.deleteOmra(req.params.id);
    res.status(200).json({ message: "Omra supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
  }
};

// ✅ Publier une Omra
const publishToSite = async (omraId) => {
  try {
    const omra = await omraService.getOmraById(omraId);
    if (!omra) {
      throw new Error("Omra non trouvée");
    }


    

    const now = new Date();
if (new Date(omra.date_de_depart) < now) {
  console.warn("❌ La date de départ de l'Omra est dépassée. Publication refusée.");
  return { message: "Impossible de publier : la date de départ est dépassée." };
    }
    
    const publicationExistante = await publicationService.getByPlatformAndOmra('site', omraId);
    if (publicationExistante) {
      throw new Error("Cette omra a déjà été publiée sur le site.");
    }

    await publicationService.publier({
      plateforme: 'site',
      id_omra: omraId,
    });

    await omraService.updateOmra(omraId, { est_publier: true });

    return { message: "Publication sur site réussie" };



  } catch (error) {
    console.error("Erreur publication site :", error.message);
    return ({ message: 'Erreur lors de la publication du OMRA sur le site', error: error.message });
  }
}




//publier Sur site seulement sans multiple
const publierSurSiteSeule = async (req, res) => {
  const  omraId = req.params.id;
  try {
    const result = await publishToSite( omraId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};




//recupérer les voyages publier sur sites
const getOmraPubliesSurSite = async (req, res) => {
  console.log("Requête reçue pour les omras publiées sur site");
  console.log("Body:", req.body);
  try {
    const publications = await publicationService.getAll({
      plateforme: "site",
    });

    // Filtrer les null dans les ids pour éviter IN (NULL)
    const idsOmras = publications
      .map(pub => pub.id_omra)
      .filter(id => id !== null);

    const omras = await Omra.findAll({
      where: {
        id: idsOmras,
        est_publier: true,
      }
    });

    // Chaque omra a une seule image, on ajoute juste le chemin complet
    const omraAvecImages = omras.map(omra => {
      return {
        ...omra.get({ plain: true }),
        image: omra.image ? `http://localhost:3000/images/${omra.image}` : null,
      };
    });

    res.status(200).json(omraAvecImages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const getDetailsOmra = async (req, res) => {
  try {
    const omraId = req.params.id;
    const result = await omraService.getOmraAvecCommentairesSelectionnes(omraId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔄 Export
module.exports = {
  create,
  getAll,
  getById,
  update,
  deletee,
  publishToSite,
  publierSurSiteSeule,
  getOmraPubliesSurSite,
 getDetailsOmra
};
