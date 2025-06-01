const { Omra , Publication ,Commentaire } = require('../models');
const { Op , Sequelize } = require("sequelize");


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
  orderDir = "DESC",
    plateforme,
  est_publier,
  annee_de_depart,
  mois_de_depart
} = {}) => {
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
  return await Omra.findAndCountAll({
    where: whereClause,
   include: includeOptions,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [[orderBy, orderDir]],
    distinct: true,
          logging: console.log // affiche la requête SQL dans la console
  });
};

// ✅ Récupérer une Omra par son ID
const getOmraById = async (id) => {
  return await Omra.findByPk(id);
};

// ✅ Mettre à jour une Omra
const updateOmra = async (id, data) => {
  const omra = await Omra.findByPk(id);
  
   if (!omra) {
    throw new Error('Omra non trouvé');
  } const now = new Date();

  // ❌ Interdire la modification si le voyage est publié ET que la date de départ est passée
  if (omra.est_publier && new Date(omra.date_de_depart) <= now) {
    throw new Error("Impossible de modifier omra publié dont la date de départ est déjà passée");
  }
  return await omra.update(data);
}; 



// ✅ Supprimer une Omra
const deleteOmra = async (id) => {
  const omra = await Omra.findByPk(id);
   if (!omra) {
    throw new Error('Voyage non trouvé');
  }

    // ❌ Interdire suppression si le voyage est publié
  if (omra.est_publier) {
    throw new Error('Impossible de supprimer un voyage publié');
  }

  return await omra.destroy();

};

// ✅ Publier une Omra sur le site (mettre à jour le champ `estPublie`)
const publishOmraToSite = async (id) => {
  const omra = await Omra.findByPk(id);
  if (!omra) throw new Error('Omra non trouvée');
  return await omra.update({ estPublie: true });
};


async function getOmraAvecCommentairesSelectionnes(omraId) {
  try {
    const omra = await Omra.findByPk(omraId);
    if (!omra) throw new Error('Omra non trouvé');

    let images = [];
    try {
      images = JSON.parse(omra.image || '[]');
    } catch (e) {
      console.warn("Erreur JSON parse sur omra.image :", e.message);
    }

    const omraAvecImages = {
      ...omra.get({ plain: true }),
      images: images.map(img => `http://localhost:3000/images/${img}`)
    };

   console.log("Recherche de la publication site pour cette Omra...");
    const publicationSite = await Publication.findOne({
      where: { id_omra: omraId, plateforme: 'site' }
    });
    if (!publicationSite) throw new Error('Publication site non trouvée');
    console.log("Publication site trouvée :", publicationSite.get({ plain: true }));

    console.log("Recherche des commentaires sélectionnés pour la publication site...");
    const commentairesSite = await Commentaire.findAll({
      where: {
        id_publication: publicationSite.id,
        est_selectionne: true
      }
    });
    console.log(`Commentaires sélectionnés sur site (count=${commentairesSite.length}) :`, commentairesSite.map(c => c.get({ plain: true })));

    console.log("Recherche des publications sociales (Facebook, Instagram) pour cette Omra...");
    const publicationsSocial = await Publication.findAll({
      where: {
        id_omra: omraId,
           plateforme: { [Op.in]: ['facebook', 'instagram'] }

      }
    });
    console.log(`Publications sociales trouvées (count=${publicationsSocial.length}) :`, publicationsSocial.map(p => p.get({ plain: true })));

    const commentairesFacebook = [];
    let urlPostFacebook = null;
    const commentairesInstagram = [];
    let urlPostInstagram = null;

    await Promise.all(
      publicationsSocial.map(async (pub) => {
        console.log(`Recherche commentaires sélectionnés pour publication id=${pub.id} plateforme=${pub.plateforme}...`);
        const comms = await Commentaire.findAll({
          where: {
            id_publication: pub.id,
            est_selectionne: true
          }
        });
        console.log(`Commentaires sélectionnés trouvés (count=${comms.length}) pour publication id=${pub.id}`);

        if (pub.plateforme === 'facebook') {
          commentairesFacebook.push(...comms);
          if (!urlPostFacebook) urlPostFacebook = pub.url_post;
          console.log(`Ajout des commentaires Facebook, total actuel: ${commentairesFacebook.length}`);
        } else if (pub.plateforme === 'instagram') {
          commentairesInstagram.push(...comms);
          if (!urlPostInstagram) urlPostInstagram = pub.url_post;
          console.log(`Ajout des commentaires Instagram, total actuel: ${commentairesInstagram.length}`);
        }
      })
    );

    console.log("Commentaires Facebook sélectionnés :", commentairesFacebook.map(c => c.get({ plain: true })));
    console.log("Commentaires Instagram sélectionnés :", commentairesInstagram.map(c => c.get({ plain: true })));

    return {
      omra: omraAvecImages,
      commentairesSite,
      commentairesFacebook,
      urlPostFacebook,
      commentairesInstagram,
      urlPostInstagram
    };
  } catch (err) {
    console.error("Erreur getOmraAvecCommentairesSelectionnes:", err.message);
    throw err;
  }
}
module.exports = {
  createOmra,
  getAllOmras,
  getOmraById,
  updateOmra,
  deleteOmra,
  publishOmraToSite,
  getOmraAvecCommentairesSelectionnes
};
