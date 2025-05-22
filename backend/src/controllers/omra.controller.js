const omraService = require("../services/omra.service");
const { Omra, Publication } = require('../models');
const { publicationService } = require('../services/publication.service.js');

// ✅ Créer une Omra
const create = async (req, res) => {
  try {
    const { titre, description, prix, date_de_depart, duree } = req.body;
    const image = req.file ? req.file.filename : null;
    console.log("req.file", req.file);

    const omra = await Omra.create({
      titre,
      prix,
      date_de_depart,
      description,
      duree,
      image,
      id_agent: 20,
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
    const { search, limit, offset, orderBy, orderDir } = req.query;

    const omras = await omraService.getAllOmras({
      search,
      limit,
      offset,
      orderBy,
      orderDir
    });

    res.status(200).json(omras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Récupérer une Omra par ID
// ✅ Récupérer une Omra par ID avec ses publications
const getById = async (req, res) => {
  try {
    const omraId = req.params.id;

    // Recherche de l'Omra avec ses publications associées
    const omra = await Omra.findOne({
      where: { id: omraId },
      include: [{
        model: Publication,  // Inclure les publications associées
        as: 'publications'   // Nom de l'association dans le modèle
      }]
    });

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
  try {

    const updatedOmra = await omraService.updateOmra(omraId, { estPublie: true });
    console.log(updatedOmra);  // Vérifie si estPublie est bien true après la mise à jour

  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
};

// ✅ Supprimer une Omra
const deletee = async (req, res) => {
  try {
    await omraService.deleteOmra(req.params.id);
    res.status(200).json({ message: "Omra supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
  }
};

// ✅ Publier une Omra
// Fonction pour publier une Omra sur le site
const publishToSite = async (req, res, silent = false) => {
  try {
    const omraId = req.params.id;
    const { plateformes = ['site'] } = req.body;

    // 1. Vérifier que l'Omra existe
    const omra = await Omra.findByPk(omraId);
    if (!omra) {
      return res.status(404).json({ message: "Omra non trouvée" });
    }

    // 2. Créer les entrées de publication
    const publications = await Promise.all(
      plateformes.map(plateforme =>
        Publication.create({
          plateforme,
          id_omra: omraId,
          date_publication: new Date(),
          statut: 'actif'
        })
      )
    );

    // 3. Mettre à jour le statut
    const updatedOmra = await omra.update({ estPublie: true });

    // 4. Préparer la réponse
    const response = {
      success: true,
      message: "Omra publiée avec succès",
      omra: updatedOmra,
      publications
    };

    if (!silent) {
      return res.status(200).json(response);
    }
    return response;

  } catch (error) {
    console.error("Erreur détaillée:", {
      message: error.message,
      stack: error.stack,
      body: req.body,
      params: req.params
    });

    if (!silent) {
      return res.status(500).json({
        success: false,
        message: "Échec de la publication",
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
    throw error;
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
};
