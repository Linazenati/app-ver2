const { Voyage } = require('../models');
const { Op } = require("sequelize");

// ✅ Créer un nouveau voyage organisé
const createVoyage = async (voyage) => {
  return await Voyage.create(voyage);
};

// ✅ Récupérer tous les voyages organisés avec recherche, pagination et tri
const getAllVoyages = async ({
  search = "",
  limit = 50,
  offset = 0,
  orderBy = "createdAt",
  orderDir = "DESC"
} = {}) => {
  const whereClause = {};

  if (search) {
    whereClause[Op.or] = [
      { titre: { [Op.like]: `%${search}%` } },
      { type: { [Op.like]: `%${search}%` } }, // si tu as un champ "type" par exemple
    ];
  }

  return await Voyage.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [[orderBy, orderDir]],
  });
};

// ✅ Récupérer un voyage par son ID
const getVoyageById = async (id) => {
  return await Voyage.findByPk(id);
  
};

// ✅ Mettre à jour un voyage
const updateVoyage = async (id, data) => {
  const voyage = await Voyage.findByPk(id);
  if (!voyage) {
    throw new Error('Voyage non trouvé');
  }
  return await voyage.update(data);
};

// ✅ Supprimer un voyage
const deleteVoyage = async (id) => {
  const voyage = await Voyage.findByPk(id);
  if (!voyage) {
    throw new Error('Voyage non trouvé');
  }
  return await voyage.destroy();
};

// ✅ Publier un voyage sur le site (mettre à jour le statut `estPublie`)
const publishToSite = async (id) => {
  const voyage = await Voyage.findByPk(id);
  if (!voyage) {
    throw new Error('Voyage non trouvé');
  }
  return await voyage.update({ est_publier: true });
};


// 🔄 Export des fonctions du service
module.exports = {
  createVoyage,
  getAllVoyages,
  getVoyageById,
  updateVoyage,
  deleteVoyage,
  publishToSite,
};
