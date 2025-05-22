const { Publication, Voyage,Omra} = require('../models');

// Fonction de publication sur une seule plateforme
const publier = async ({ plateforme, id_voyage = null, id_omra = null, id_post_facebook = null, id_post_instagram = null }) => {

  
    const publication = await Publication.create({
    date_publication: new Date(),
    plateforme,
    statut: 'disponible',
    id_omra: id_omra || null,
    id_voyage: id_voyage || null,
    id_post_facebook,
    id_post_instagram
  });

  return publication;
};



const getAll = async ({  
   search = "",              // Mot-clé de recherche (par défaut vide)
  limit = 50,               // Nombre maximum de résultats à retourner (pagination)
  offset = 0,               // Position de départ dans les résultats (pagination)
  orderBy = "createdAt",    // Champ par lequel trier les résultats (ex: "createdAt")
  orderDir = "DESC"         // Ordre de tri : "ASC" (croissant) ou "DESC" (décroissant)
} = {}) => {
  // Initialisation de la clause WHERE pour les filtres
  const whereClause = {};

  // 🔍 Si un mot-clé de recherche est fourni, ajouter des conditions "LIKE" pour nom, email et rôle
  if (search) {
    whereClause[Op.or] = [
      { nom: { [Op.like]: `%${search}%` } },     // Filtre sur le champ "nom"
      { email: { [Op.like]: `%${search}%` } },   // Filtre sur le champ "email"
      { role: { [Op.like]: `%${search}%` } },    // Filtre sur le champ "role"
    ];
  }

  // 📦 Exécution de la requête avec Sequelize :
  // Exécution de la requête avec Sequelize, en incluant les relations pour Voyage et Omra
  return await Publication.findAndCountAll({
    where: whereClause,
    include: [
      { model: Voyage, as: 'voyage', attributes: ['titre'] },
      { model: Omra, as: 'omra', attributes: ['nom'] }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [[orderBy, orderDir]],
  });

  
};

const getById = async (id) => {
  return await Publication.findByPk(id);
};

const getByIdOmra = async (idOmra) => {
  return await Publication.findAll({
    where:{
      id_omra:idOmra
    }
  })
}

module.exports = {
  publier,
  getAll,
  getById,
  getByIdOmra
};
