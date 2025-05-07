const omraService = require("../services/omra.service");
const { Omra } = require('../models');

// ✅ Créer une Omra
const create = async (req, res) => {
  try {
    const { titre, description, prix,  date_de_depart, duree } = req.body;
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
  try {
    const updatedOmra = await omraService.updateOmra(req.params.id, req.body);
    res.status(200).json(updatedOmra);
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
const publishToSite = async (req, res) => {
  try {
    const omraId = req.params.id;
    const omra = await omraService.getOmraById(omraId);

    if (!omra) {
      return res.status(404).json({ message: "Omra non trouvée" });
    }

    const updatedOmra = await omraService.updateOmra(omraId, { estPublie: true });

    res.status(200).json({
      success: true,
      message: "Omra publiée sur le site",
      omra: updatedOmra,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la publication de l'Omra",
      error: error.message,
    });
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
