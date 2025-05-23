const { Publication, Voyage } = require('../models');

// Fonction de publication sur une seule plateforme
const publier = async ({ plateforme, id_voyage = null, id_omra = null, id_post_facebook = null, id_post_instagram = null, url_post = null }) => {
  const publication = await Publication.create({
    date_publication: new Date(),
    plateforme,
    statut: 'disponible',
    id_omra: id_omra || null,
    id_voyage: id_voyage || null,
    id_post_facebook,
    id_post_instagram,
    url_post
  });

  return publication;
};

// Récupérer toutes les publications
const getAll = async () => {
  return await Publication.findAll({
    include: [
      { model: Voyage, as: 'voyage', attributes: ['titre'] },
    ],
    order: [['createdAt', 'DESC']]
  });
};

// Récupérer une publication par ID
const getById = async (id) => {
  return await Publication.findByPk(id);
};

// Récupérer les publications liées à une Omra
const getByIdOmra = async (idOmra) => {
  return await Publication.findAll({
    where: {
      id_omra: idOmra
    }
  });
};

// Récupérer les publications d’un voyage publié
const getPublicationsByVoyageId = async (voyageId) => {
  return await Publication.findAll({
    where: { id_voyage: voyageId },
    include: [
      {
        model: Voyage,
        as: 'voyage',
        attributes: ['titre', 'est_publier'],
        where: { est_publier: true }
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

// Récupérer une publication selon la plateforme et l'ID de voyage
const getByPlatformAndVoyage = async (plateforme, id_voyage) => {
  return await Publication.findOne({
    where: { plateforme, id_voyage }
  });
};

module.exports = {
  publier,
  getAll,
  getById,
  getByIdOmra,
  getPublicationsByVoyageId,
  getByPlatformAndVoyage
};
