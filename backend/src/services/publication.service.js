const { Publication, Voyage, Omra} = require('../models');
const { recupererLikesFacebook } = require("./facebook.service");
const { recupererLikesInstagram } = require("./instagram.service");
const { PAGE_ID: FACEBOOK_PAGE_ID } = require('../config/facebook.config'); // Assure-toi d'importer ça
const { INSTAGRAM_USER_ID  } = require('../config/instagram.config'); // Assure-toi d'importer ça
const { Op  } = require("sequelize");

// Fonction de publication sur une seule plateforme
const publier = async ({ plateforme, id_voyage = null, id_omra = null, id_post_facebook = null, id_post_instagram = null ,  url_post = null}) => {

  
    const publication = await Publication.create({
    date_publication: new Date(),
    plateforme,
    statut: 'disponible',
  
  
    id_voyage,
    id_omra,
    id_post_facebook,
      id_post_instagram,
      url_post
  });

  return publication;
};



const getAll = async () => {
    return await Publication.findAll({
    include: [
      { model: Voyage, as: 'voyage', attributes: ['titre'], required: false },
      { model: Omra, as: 'omra', attributes: ['titre'], required: false },
    ],
    order: [['createdAt', 'DESC']]
  });
};

 

const getById = async (id) => {
  return await Publication.findByPk(id);
};

// ✅ Récupérer les publications liées à un voyage publié
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

const getByPlatformAndVoyage = async (plateforme, id_voyage) => {
  return await Publication.findOne({
    where: { plateforme, id_voyage }
  });
};

const getByPlatformAndOmra =async (plateforme, id_omra) => {
  return await Publication.findOne({
    where: { plateforme, id_omra }
  });
};

// ✅ Récupérer les publications liées à une Omra publiée
const getPublicationsByOmraId = async (omraId) => {
  return await Publication.findAll({
    where: { id_omra: omraId },
    include: [
      {
        model: Omra,
        as: 'omra',
        attributes: ['titre', 'est_publier'],
        where: { est_publier: true }
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

const updateNbrLikes = async (id, nbr_likes) => {
  return await Publication.update({ nbr_likes }, { where: { id } });
};

const getLikesBase = async (plateforme, id_post) => {
  let publication;

  if (plateforme === 'facebook') {
    publication = await Publication.findOne({ where: { id_post_facebook: id_post } });
  } else if (plateforme === 'instagram') {
    publication = await Publication.findOne({ where: { id_post_instagram: id_post } });
  } else {
    return null; // plateforme non supportée
  }

  if (!publication) {
    return null; // publication non trouvée
  }

  return publication.nbr_likes || 0;
};


const getPagePublications = async (plateforme) => {
    let idPrefix;
  let idField;

  switch (plateforme) {
    case 'facebook':
      idPrefix = `${FACEBOOK_PAGE_ID}_`;
      idField = 'id_post_facebook';
      break;
    case 'instagram':
      idPrefix = `${INSTAGRAM_USER_ID}_`;
      idField = 'id_post_instagram';
      break;
    default:
      throw new Error(`Plateforme non prise en charge : ${plateforme}`);
  }

  return await Publication.findAll({
    where: {
      plateforme,
      [idField]: {
        [Op.and]: [
          { [Op.ne]: null },
          { [Op.like]: `${idPrefix}%` },
        ]
      }
    },
    include: [
      { model: Voyage, as: 'voyage', attributes: ['titre'], required: false },
      { model: Omra, as: 'omra', attributes: ['titre'], required: false },
    ],
    order: [['createdAt', 'DESC']],
  });
};

module.exports = {
  publier,
  getAll,
  getById,
  getPublicationsByVoyageId,
  getByPlatformAndVoyage,
  getByPlatformAndOmra,
  getPublicationsByOmraId,
  updateNbrLikes,
  getLikesBase,
  getPagePublications 
};
