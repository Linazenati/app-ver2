// src/controllers/utilisateur.controller.js

const utilisateurService = require('../services/utilisateur.service');

// ✅ Créer un nouvel utilisateur AGENT
const create = async (req, res) => {
  try {
     

    // Combine query et body pour plus de souplesse
    const data = {
      ...req.body,
      ...req.query, // au cas où l'appel vient d'un formulaire GET
      role: 'agent'
    };
    console.log("Requête reçue pour création d'agent :", data); // Affiche les données envoyées

    const { email } = data;

    // Vérifie si un utilisateur avec le même email existe
    const emailExistant = await utilisateurService.getUtilisateurByEmail(email);
    if (emailExistant) {
      return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà." });
    }
    
    const utilisateur = await utilisateurService.createUtilisateur(data);
    res.status(201).json(utilisateur);
  } catch (error) {
    console.error("Erreur dans la création de l'agent :", error.message);
    res.status(500).json({ message: error.message });
  }
};


// ✅ Récupérer tous les utilisateurs avec recherche, pagination et tri
const getAll = async (req, res) => {
  try {
    // Récupère les paramètres de query dans l'URL (facultatifs)
    const { search, limit, offset, orderBy, orderDir, role } = req.query.params || {};;
    console.log("Requête reçue avec query :", req.query.params);

    const utilisateurs = await utilisateurService.getAllUtilisateurs({
      search,
      limit,
      offset,
      orderBy,
      orderDir,
      role   // Passe le paramètre de rôle au service
    });

    res.status(200).json(utilisateurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Récupérer un utilisateur par son ID
const getOne = async (req, res) => {
  try {
    const utilisateur = await utilisateurService.getUtilisateurById(req.params.id);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Mettre à jour un utilisateur
const update = async (req, res) => {
  try {
    const utilisateur = await utilisateurService.updateUtilisateur(req.params.id, req.body);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Supprimer un utilisateur
const deleteUtilisateur = async (req, res) => {
  try {
    const result = await utilisateurService.deleteUtilisateur(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔄 Export des contrôleurs
module.exports = {
  create,
  getAll,
  getOne,
  update,
  delete: deleteUtilisateur,
};
