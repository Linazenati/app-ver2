// controllers/commentaire.controller.js

const { recupererCommentaires } = require('../services/instagram.service');
const { Publication } = require('../models');
const commentaireService = require('../services/commentaire.service');
/**
 * Récupérer et stocker les commentaires d'une publication Instagram
 * @param {Request} req 
 * @param {Response} res 
 */
const partagerCommentaire = async (req, res) => {
  try {
    const { id_instagram_post, id_publication } = req.body; // récupérer les données du corps de la requête (id_post Instagram et id_publication)

    // Vérifier que l'ID de publication existe
    const publication = await Publication.findByPk(id_publication);
    if (!publication) {
      return res.status(404).json({ message: 'Publication non trouvée' });
    }

    // Appeler le service pour récupérer et stocker les commentaires
    const commentaires = await recupererCommentaires(id_instagram_post, id_publication);

    // Répondre avec les commentaires récupérés
    return res.status(200).json({
      message: `Commentaires pour la publication ${id_publication} récupérés et stockés`,
      commentaires,
    });
  } catch (error) {
    console.error('❌ Erreur dans le controller des commentaires:', error.message);
    return res.status(500).json({ message: 'Erreur serveur lors de l\'enregistrement des commentaires', error: error.message });
  }
};
/**
 * Mettre à jour la sélection d'un commentaire
 */
const    updateSelectionCommentaire= async (req, res) => {
  try {
    const { id_commentaire_plateforme, plateforme, est_selectionne } = req.body;

    if (!id_commentaire_plateforme || !plateforme || est_selectionne === undefined) {
      return res.status(400).json({ message: "Champs manquants ou invalides" });
    }

    const commentaire = await commentaireService.mettreAJourSelection(id_commentaire_plateforme, plateforme, est_selectionne);
    return res.status(200).json({ message: 'Statut mis à jour', commentaire });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Récupérer les commentaires sélectionnés selon la plateforme
 */
const getCommentairesSelectionnes = async (req, res) => {
  try {
    const { plateforme } = req.query;
    const commentaires = await commentaireService.recupererSelectionnesParPlateforme(plateforme);
    return res.status(200).json(commentaires);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};


const getCommentairesInstagram = async (req, res) => {
  try {
        const id_publication = req.params.id_publication;

    const commentaires = await  commentaireService.getCommentairesInstagramParVoyage(id_publication);
    res.status(200).json(commentaires);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCommentairesFacebook = async (req, res) => {
  try {
    const id_publication = req.params.id_publication;
    const commentaires = await commentaireService.getCommentairesFacebookParVoyage(id_publication);
    res.status(200).json(commentaires);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getNouveauxCommentaires = async (req, res) => {
  const id_publication = req.params.id_publication;

  try {
    const commentaires = await commentaireService.getNouveauxCommentaires(id_publication);
    res.json(commentaires);
  } catch (error) {
    console.error("❌ Erreur récupération nouveaux commentaires :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
module.exports = {
  partagerCommentaire,
    updateSelectionCommentaire,
  getCommentairesSelectionnes,
  getCommentairesInstagram,
  getCommentairesFacebook,
  getNouveauxCommentaires
};
