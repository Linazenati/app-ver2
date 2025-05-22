const { Voyage, Publication ,Commentaire,sequelize } = require('../models');
const { Op , Sequelize } = require("sequelize");

// ✅ Créer un nouveau voyage organisé
const createVoyage = async (voyage) => {
  return await Voyage.create(voyage);
};

// ✅ Récupérer tous les voyages organisés avec recherche, pagination et tri
const getAllVoyages = async ({
  search = '',
  limit = 50,
  offset = 0,
  orderBy = 'createdAt',
  orderDir = 'ASC',
  plateforme,
  est_publier,
  annee_de_depart,
  mois_de_depart
}) => {
  const whereClause = {};
  const includeOptions = [];
  
  // 🔎 Filtre texte
  if (search) {
    whereClause[Op.or] = [
      { titre: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }

  // ✅ Filtre publication
  if (typeof est_publier !== 'undefined') {
    whereClause.est_publier = est_publier === 'true';
  }

  // 📅 Filtre date (toujours actif si paramètres fournis)
   // 🗓️ Filtre date totalement indépendant de est_publier
  if (annee_de_depart || mois_de_depart) {
    const dateConditions = [];

    // Année seule
    if (annee_de_depart) {
      const year = parseInt(annee_de_depart);
      dateConditions.push(Sequelize.where(
        Sequelize.fn('YEAR', Sequelize.col('date_de_depart')),
        year
      ));
    }

    // Mois seul
    if (mois_de_depart && !annee_de_depart) {
      const month = parseInt(mois_de_depart);
      dateConditions.push(Sequelize.where(
        Sequelize.fn('MONTH', Sequelize.col('date_de_depart')),
        month
      ));
    }

    // Année + Mois
    if (annee_de_depart && mois_de_depart) {
      const year = parseInt(annee_de_depart);
      const month = parseInt(mois_de_depart);
      dateConditions.push(
        Sequelize.where(
          Sequelize.fn('YEAR', Sequelize.col('date_de_depart')),
          year
        ),
        Sequelize.where(
          Sequelize.fn('MONTH', Sequelize.col('date_de_depart')),
          month
        )
      );
    }

    whereClause[Op.and] = dateConditions;
  }

  // 📱 Filtre plateforme (uniquement si est_publier=true)
  if (est_publier === 'true') {
    const publicationWhere = {};
    
    if (plateforme) {
      publicationWhere.plateforme = plateforme;
      includeOptions.push({
        model: Publication,
        as: 'publications',
        where: publicationWhere,
        required: true // INNER JOIN pour filtrer
      });
    } else {
      includeOptions.push({
        model: Publication,
        as: 'publications',
        required: false // LEFT JOIN pour toutes publications
      });
    }
  }

  // 🚀 Exécution de la requête
  const result = await Voyage.findAndCountAll({
    where: whereClause,
    include: includeOptions,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [[orderBy, orderDir]],
    distinct: true
  });

  return {
    data: result.rows,
    total: result.count
  };
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
  } const now = new Date();

  // ❌ Interdire la modification si le voyage est publié ET que la date de départ est passée
  if (voyage.est_publier && new Date(voyage.date_de_depart) <= now) {
    throw new Error("Impossible de modifier un voyage publié dont la date de départ est déjà passée");
  }
  return await voyage.update(data);
}; 





// ✅ Supprimer un voyage
const deleteVoyage = async (id) => {
  const voyage = await Voyage.findByPk(id);
  if (!voyage) {
    throw new Error('Voyage non trouvé');
  }

    // ❌ Interdire suppression si le voyage est publié
  if (voyage.est_publier) {
    throw new Error('Impossible de supprimer un voyage publié');
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


async function getVoyageAvecCommentairesSelectionnes(voyageId) {
  const voyage = await Voyage.findByPk(voyageId);
  if (!voyage) throw new Error('Voyage non trouvé');

  // Formatage des images avec URLs complètes
  const images = JSON.parse(voyage.image || '[]');
  const voyageAvecImages = {
    ...voyage.get({ plain: true }),
    images: images.map(img => `http://localhost:3000/images/${img}`)
  };

  // Publication site
  const publicationSite = await Publication.findOne({
    where: { id_voyage: voyageId, plateforme: 'site' }
  });
  if (!publicationSite) throw new Error('Publication site non trouvée');

  // Commentaires sélectionnés site
  const commentairesSite = await Commentaire.findAll({
    where: {
      id_publication: publicationSite.id,
      est_selectionne: true
    }
  });

  // Publications réseaux sociaux (Facebook, Instagram)
  const publicationsSocial = await Publication.findAll({
    where: {
      id_voyage: voyageId,
      plateforme: ['facebook', 'instagram']
    }
  });

  // 5. Récupérer et séparer les commentaires sociaux
  const commentairesFacebook = [];
  let urlPostFacebook = null;
  
  const commentairesInstagram = [];
  let urlPostInstagram = null;
  
  await Promise.all(
    publicationsSocial.map(async (pub) => {
      const comms = await Commentaire.findAll({
        where: {
          id_publication: pub.id,
          est_selectionne: true
        }
      });

      if (pub.plateforme === 'facebook') {
        commentairesFacebook.push(...comms);
          // Si plusieurs publications Facebook, on garde la première url_post (ou adapter selon besoin)
        if (!urlPostFacebook) urlPostFacebook = pub.url_post;
      } else if (pub.plateforme === 'instagram') {
        commentairesInstagram.push(...comms);
         if (!urlPostInstagram) urlPostInstagram = pub.url_post;
      }
    })
  );
  return {
    voyage: voyageAvecImages,
    commentairesFacebook,
         urlPostFacebook,
    commentairesInstagram,
        urlPostInstagram
  };
}
// 🔄 Export des fonctions du service
module.exports = {
  createVoyage,
  getAllVoyages,
  getVoyageById,
  updateVoyage,
  deleteVoyage,
  publishToSite,
   getVoyageAvecCommentairesSelectionnes
};
