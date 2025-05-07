const { Omra } = require('../models');
const { Op } = require("sequelize");

// ✅ Créer une nouvelle Omra
const createOmra = async (omra) => {
  return await Omra.create(omra);
};

// ✅ Récupérer toutes les Omras avec recherche, pagination et tri
const getAllOmras = async ({
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
      { description: { [Op.like]: `%${search}%` } },
    ];
  }

  return await Omra.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [[orderBy, orderDir]],
  });
};

// ✅ Récupérer une Omra par son ID
const getOmraById = async (id) => {
  return await Omra.findByPk(id);
};

// ✅ Mettre à jour une Omra
const updateOmra = async (id, data) => {
  const omra = await Omra.findByPk(id);
  if (!omra) throw new Error('Omra non trouvée');
  return await omra.update(data);
};

// ✅ Supprimer une Omra
const deleteOmra = async (id) => {
  const omra = await Omra.findByPk(id);
  if (!omra) throw new Error('Omra non trouvée');
  return await omra.destroy();
};

// ✅ Publier une Omra sur le site (mettre à jour le champ `estPublie`)
const publishOmra = async (id) => {
  const omra = await Omra.findByPk(id);
  if (!omra) throw new Error('Omra non trouvée');
  return await omra.update({ estPublie: true });
};

module.exports = {
  createOmra,
  getAllOmras,
  getOmraById,
  updateOmra,
  deleteOmra,
  publishOmra,
};
