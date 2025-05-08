// src/services/utilisateur.service.js

const { Utilisateur, Client, Agent, Administrateur } = require('../models');
const { Op } = require("sequelize"); // Importe les opérateurs Sequelize (comme Op.like pour les filtres avancés)
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require("../config/jwt.config");


// ✅ Créer un nouvel utilisateur
const createUtilisateur = async (data) => {
  // Hash du mot de passe avec le champ 'motDePasse'
  const hashedPassword = await bcrypt.hash(data.password, 10);
  // Utiliser 'motDePasse' au lieu de 'password'
  const utilisateur = await Utilisateur.create({
    ...data,
    password: hashedPassword  // 'password' est le champ utilisé dans la base de données
  });


  if (data.role === 'Utilisateur_inscrit') {
    await Utilisateur_inscrit.create({ id: utilisateur.id, adresse:data.adresse  });
  } else if (data.role === 'agent') {
    await Agent.create({ id: utilisateur.id , matricule: data.matricule, dateEmbauche: data.dateEmbauche });
  } else if (data.role === 'admin') {
    await Administrateur.create({ id: utilisateur.id });
  }
  else if (data.role === 'client') {
    await Client.create({ id: utilisateur.id });
     
  };
 
  

  // Créer le rôle associé

  if (utilisateur.role === "client") {
    await Client.create({
      "id": utilisateur.id,
      "adresse": "Aucune"
    });
  }
  else if (utilisateur.role === "administrateur") {
    await Administrateur.create({
      "id": utilisateur.id,
    });
  }
  else if (utilisateur.role === "agent") {
    await Agent.create({
      "id": utilisateur.id,
      "matricule": "123654",
      "dateEmbauche": "2024-03-15"
    });
  }

  return utilisateur;
};



// ✅ Récupérer tous les utilisateurs avec recherche, pagination et tri
const getAllUtilisateurs = async ({
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
  return await Utilisateur.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [[orderBy, orderDir]],  // Ex: [['createdAt', 'DESC']]
  });
};


// ✅ Récupérer un utilisateur par son ID
const getUtilisateurById = async (id) => {
  return await Utilisateur.findByPk(id);
};

const getUtilisateurByEmail = async (email) => {
  return await Utilisateur.findOne({ where: { email } });
};

const getUtilisateurByMatricule = async (matricule) => {
  return await Utilisateur.findOne({ where: { matricule } });
};

// ✅ Mettre à jour un utilisateur existant
const updateUtilisateur = async (id, data) => {
  const utilisateur = await Utilisateur.findByPk(id);
  if (!utilisateur) {
    throw new Error('Utilisateur non trouvé');
  }
  return await utilisateur.update(data);
};


// ✅ Supprimer un utilisateur
const deleteUtilisateur = async (id) => {
  const utilisateur = await Utilisateur.findByPk(id);
  if (!utilisateur) {
    throw new Error('Utilisateur non trouvé');
  }
  return await utilisateur.destroy();
};

// ✅ Login utilisateur
const login = async (credentials) => {
  const { email, password } = credentials; // ⬅️ change ici (plus de motDePasse)
  console.log('Email reçu dans le service login:', email); // pour voir l'email passé
  const utilisateur = await Utilisateur.findOne({ where: { email } });
  console.log('Résultat de findOne:', utilisateur); // pour voir le résultat de Sequelize
  if (!utilisateur) {
    throw new Error("Utilisateur non trouvé");
  }

  console.log("🔐 Mot de passe envoyé depuis le client :", password);
  console.log("🧊 Mot de passe hashé depuis la BDD :", utilisateur?.password);

  const passwordMatch = await bcrypt.compare(password, utilisateur.password);
  if (!passwordMatch) {
    throw new Error("Mot de passe incorrect");
  }

  // Générer un token JWT
  const token = jwt.sign(
    { id: utilisateur.id, email: utilisateur.email, role: utilisateur.role },
    SECRET_KEY,
    { expiresIn: '1d' }
  );

  return {
    utilisateur: {
      id: utilisateur.id,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      email: utilisateur.email,
      role: utilisateur.role
    },
    token
  };
};



// ✅ Logout (si stockage dans cookie, tu videras côté contrôleur)
const logout = async () => {
  return true; // Rien à faire côté service si JWT stateless
};


// ✅ Register
const register = async (data) => {
  const existing = await Utilisateur.findOne({ where: { email: data.email } });
  if (existing) {
    throw new Error("Email déjà utilisé");
  }
  return await createUtilisateur(data);
};


// ✅ Obtenir utilisateur actuel via son ID (issu du JWT)
const getCurrentUser = async (userId) => {
  const utilisateur = await Utilisateur.findByPk(userId, {
    attributes: { exclude: ['motdepasse'] }  // Exclure le mot de passe dans la réponse
  });

  if (!utilisateur) {
    throw new Error("Utilisateur non trouvé");
  }

  return utilisateur;
};


// 🔄 Export des fonctions du service
module.exports = {
  createUtilisateur,
  getAllUtilisateurs,
  getUtilisateurById,
  getUtilisateurByEmail,
  getUtilisateurByMatricule,
  updateUtilisateur,
  deleteUtilisateur,
  login, logout, register, getCurrentUser
};
