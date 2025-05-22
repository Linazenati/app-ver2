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
// Dans omraService.js
const updateOmra = async (id, data) => {
  try {
    const omra = await Omra.findByPk(id);  // Cherche l'Omra par son ID
    if (!omra) {
      throw new Error('Omra non trouvée');
    }

    // Mets à jour les informations de l'Omra
    const updatedOmra = await omra.update(data);  // Utilise l'instance pour mettre à jour directement
    return updatedOmra;  // Retourne l'Omra mise à jour
  } catch (error) {
    throw new Error(`Erreur lors de la mise à jour de l'Omra: ${error.message}`);
  }
};




// ✅ Supprimer une Omra
const deleteOmra = async (id) => {
  const omra = await Omra.findByPk(id);
  if (!omra) throw new Error('Omra non trouvée');
  return await omra.destroy();
};

// ✅ Publier une Omra sur le site (mettre à jour le champ `estPublie`)
const publishOmra = async (id, plateformes = ['site']) => {
  // 1. Vérifier que l'Omra existe
  const omra = await Omra.findByPk(id);
  if (!omra) throw new Error('Omra non trouvée');

  // 2. Créer les entrées dans Publications
  const publications = await Promise.all(
    plateformes.map(plateforme => 
      Publication.create({
        plateforme,
        id_omra: id,
        date_publication: new Date(),
        statut: 'actif'
      })
    )
  );

  // 3. Mettre à jour le statut
  await omra.update({ estPublie: true });

  return {
    omra,
    publications
  };
};

module.exports = {
  createOmra,
  getAllOmras,
  getOmraById,
  updateOmra,
  deleteOmra,
  publishOmra,
};
