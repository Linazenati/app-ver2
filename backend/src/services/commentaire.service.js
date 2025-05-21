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
    for (const commentaire of commentaires) {
      const isInstagram = source === 'instagram';

      // Vérifie si le commentaire existe déjà pour éviter les doublons
      const exist = await Commentaire.findOne({
        where: isInstagram
          ? { id_commentaire_instagram: commentaire.id, id_publication }
          : { id_commentaire_facebook: commentaire.id, id_publication },
      });

      if (!exist) {
        // Prépare les données pour la création
        const data = {
          id_publication,
          contenu: isInstagram ? commentaire.text : commentaire.message,
          date_commentaire: new Date(isInstagram ? commentaire.timestamp : commentaire.created_time),
          id_commentaire_instagram: isInstagram ? commentaire.id : null,
          id_commentaire_facebook: !isInstagram ? commentaire.id : null,
        };

        // Création du commentaire
        await Commentaire.create(data);
        console.log(`💾 Commentaire ${source} sauvegardé : ${data.contenu}`);
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
      ? { id_commentaire_instagram: commentId, id_publication: publicationId }
      : { id_commentaire_facebook: commentId, id_publication: publicationId };

    const result = await Commentaire.destroy({
      where: whereClause,
    });

    if (result) {
      console.log(`✅ Commentaire ${source} supprimé en base de données.`);
    } else {
      console.warn(`⚠️ Aucun commentaire ${source} trouvé avec cet ID en base de données.`);
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

module.exports = {
  sauvegarderCommentaires,
  supprimerCommentaireEnBase,
    mettreAJourSelection,
  recupererSelectionnesParPlateforme,
};
