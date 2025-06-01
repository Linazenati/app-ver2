const { Commentaire, Publication } = require("../models");
const { Op } = require('sequelize');

/**
 * Sauvegarde les commentaires Instagram ou Facebook dans la base de données
 * @param {number} id_publication - ID de la publication dans votre base de données
 * @param {Array} commentaires - Liste des commentaires
 * @param {string} source - Type de source ('instagram' ou 'facebook')
 *  @param {string} commentId - ID du commentaire (Instagram ou Facebook)
 * @param {number} publicationId - ID de la publication associée
 * @param {string} source - Type de source ('instagram' ou 'facebook')
 */
async function sauvegarderCommentaires(id_publication, commentaires, source = 'instagram') {
  try {
    const isInstagram = source === 'instagram';

    for (const commentaire of commentaires) {
      const commentaireId = commentaire.id;

      // Vérifier si le commentaire existe déjà dans la base
      const exist = await Commentaire.findOne({
        where: isInstagram
          ? { id_commentaire_instagram: commentaireId, id_publication }
          : { id_commentaire_facebook: commentaireId, id_publication },
      });

      if (!exist) {
        const data = {
          id_publication,
          contenu: isInstagram ? commentaire.text : commentaire.message,
          date_commentaire: new Date(isInstagram ? commentaire.timestamp : commentaire.created_time),
          id_commentaire_instagram: isInstagram ? commentaireId : null,
          id_commentaire_facebook: !isInstagram ? commentaireId : null,
          auteur: commentaire.username || commentaire.from?.name || 'Inconnu',
          est_nouveau: true, // ✅ Marqué comme nouveau
        };

        await Commentaire.create(data);
        console.log(`🆕 Nouveau commentaire ${source} sauvegardé : "${data.contenu}"`);
      } else {
        console.log(`↩️ Commentaire ${source} déjà existant ignoré : ${commentaireId}`);
      }
    }
  } catch (error) {
    console.error("❌ Erreur lors de la sauvegarde des commentaires :", error.message);
    throw new Error("Erreur lors de la sauvegarde des commentaires");
  }
}

async function supprimerCommentaireEnBase(commentId, publicationId, source = 'instagram') {
  try {
    const whereClause = source === 'instagram'
      ? { id_commentaire_instagram: commentId }
      : { id_commentaire_facebook: commentId };

    // Si tu veux absolument filtrer par publicationId aussi :
    if (publicationId) {
      whereClause.id_publication = publicationId;
    }

    console.log('Tentative de suppression avec :', whereClause);

    // Vérifier d'abord si le commentaire existe
    const commentaire = await Commentaire.findOne({ where: whereClause });
    if (!commentaire) {
      console.warn(`⚠️ Aucun commentaire ${source} trouvé avec cet ID et publicationId en base de données.`);
      return;
    }

    // Suppression
    const result = await Commentaire.destroy({
      where: whereClause,
    });

    if (result) {
      console.log(`✅ Commentaire ${source} supprimé en base de données.`);
    } else {
      console.warn(`⚠️ Échec suppression commentaire ${source} (inattendu).`);
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la suppression du commentaire ${source} en base de données :`, error.message);
    throw new Error(`Erreur lors de la suppression du commentaire ${source} en base de données`);
  }
}


const mettreAJourSelection = async (id_commentaire_plateforme, plateforme, est_selectionne) => {
  let whereCondition = {};
  if (plateforme === "instagram") {
    whereCondition = { id_commentaire_instagram: id_commentaire_plateforme };
  } else if (plateforme === "facebook") {
    whereCondition = { id_commentaire_facebook: id_commentaire_plateforme };
  } else {
    throw new Error("Plateforme inconnue");
  }

  const commentaire = await Commentaire.findOne({ where: whereCondition });

  if (!commentaire) {
    throw new Error("Commentaire non trouvé");
  }

  commentaire.est_selectionne = est_selectionne;
  await commentaire.save();

  return commentaire;
};


async function recupererSelectionnesParPlateforme(voyageId, plateformes) {
  // Récupérer les publications du voyage pour les plateformes demandées
  const publications = await Publication.findAll({
    where: {
      id_voyage: voyageId,
      plateforme: plateformes
    }
  });

  // Récupérer tous les commentaires sélectionnés
  let commentaires = [];
  for (const pub of publications) {
    const comms = await Commentaire.findAll({
      where: {
        id_publication: pub.id,
        est_selectionne: true
      }
    });
    commentaires = commentaires.concat(comms);
  }
  return commentaires;
}

async function getCommentairesInstagramParVoyage(id_publication) {
  const commentaires = await Commentaire.findAll({
    where: {
      id_publication,
      id_commentaire_instagram: { [Op.ne]: null } // filtre seulement ceux d'Instagram
    }
  });
  // Met à jour est_nouveau à false pour ceux qui sont encore marqués comme nouveaux
  await Commentaire.update(
    { est_nouveau: false },
    {
      where: {
        id_publication,
        id_commentaire_instagram: { [Op.ne]: null },
        est_nouveau: true
      }
    }
  );

  return commentaires;
}

async function getCommentairesFacebookParVoyage(id_publication) {
  const commentaires = await Commentaire.findAll({
    where: {
      id_publication,
      id_commentaire_facebook: { [Op.ne]: null } // filtre seulement ceux de Facebook
    }
  });
  await Commentaire.update(
    { est_nouveau: false },
    {
      where: {
        id_publication,
        id_commentaire_facebook: { [Op.ne]: null },
        est_nouveau: true
      }
    }
  );
   return commentaires;
}


const getNouveauxCommentaires = async (id_publication) => {
  try {
    const commentaires = await Commentaire.findAll({
      where: {
        id_publication: id_publication,
        est_nouveau: true
      },
      order: [['date_commentaire', 'DESC']]
    });

    return commentaires;
  } catch (error) {
    console.error("❌ Erreur dans le service - récupération nouveaux commentaires :", error);
    throw error;
  }
};

module.exports = {
  sauvegarderCommentaires,
  supprimerCommentaireEnBase,
    mettreAJourSelection,
  recupererSelectionnesParPlateforme,
  getCommentairesInstagramParVoyage,
  getCommentairesFacebookParVoyage,
  getNouveauxCommentaires
};
