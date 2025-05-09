const { Publication, Voyage} = require('../models');

// Fonction de publication sur une seule plateforme
const publier = async ({ plateforme, id_voyage = null, id_omra = null, id_post_facebook = null, id_post_instagram = null }) => {

  
    const publication = await Publication.create({
    date_publication: new Date(),
    plateforme,
    statut: 'disponible',
    id_voyage,
    id_omra,
    id_post_facebook,
    id_post_instagram
  });

  return publication;
};



const getAll = async () => {
  return await Publication.findAll({
    include: [
      { model: Voyage, as: 'voyage', attributes: ['titre'] },
    ],
    order: [['createdAt', 'DESC']]
  });
};

 

const getById = async (id) => {
  return await Publication.findByPk(id);
};

module.exports = {
  publier,
  getAll,
  getById
};
