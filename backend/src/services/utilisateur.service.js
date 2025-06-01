// src/services/utilisateur.service.js

const { Utilisateur, Client, Agent, Administrateur,Utilisateur_inscrit } = require('../models');
const { Op } = require("sequelize"); // Importe les opérateurs Sequelize (comme Op.like pour les filtres avancés)
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require("../config/jwt.config");


// ✅ Créer un nouvel utilisateur
const createUtilisateur = async (data) => {
   if (!data.role || !['client', 'agent', 'admin', 'Utilisateur_inscrit'].includes(data.role)) {
        throw new Error("Le rôle de l'utilisateur doit être spécifié et valide (client, agent, admin, Utilisateur_inscrit)");
    }

  // Hash du mot de passe avec le champ 'motDePasse'
  const hashedPassword = await bcrypt.hash(data.password, 10);
  // Utiliser 'motDePasse' au lieu de 'password'
  const utilisateur = await Utilisateur.create({
    ...data,
    password: hashedPassword,
    dateDerniereConnexion : new Date() // 'password' est le champ utilisé dans la base de données
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
  return utilisateur;
  

  // Créer le rôle associé

  
  
};



// ✅ Récupérer tous les utilisateurs avec recherche, pagination et tri
const getAllUtilisateurs = async ({
  search = "",// Mot-clé de recherche (par défaut vide)
    role = null,
  limit = 50,// Nombre maximum de résultats à retourner (pagination)
  offset = 0,// Position de départ dans les résultats (pagination)
  orderBy = "createdAt",    // Champ par lequel trier les résultats (ex: "createdAt")
  orderDir = "DESC"         // Ordre de tri : "ASC" (croissant) ou "DESC" (décroissant)
} = {}) => {
  // Initialisation de la clause WHERE pour les filtres
  const whereClause = {};

  
  if (role) {
    whereClause.role = role;
  }
  
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

   //admin 
     if (utilisateur.role === 'administrateur') {
       const administrateur = await Administrateur.findOne({ where: { id: utilisateur.id } });
       if (administrateur) {
         await administrateur.update();
       }
        
                    console.log(`Update: admin ${id} mis à jour`);

  }
  
  //agent 
   if (utilisateur.role === 'agent') {
        const agent = await Agent.findOne({ where: { id: utilisateur.id } });
        if (!agent) {
            throw new Error('Agent introuvable');
        }
        await agent.update({
            matricule: data.matricule || agent.matricule,
            dateEmbauche: data.dateEmbauche || agent.dateEmbauche
        });
            console.log(`Update: Agent ${id} mis à jour`);
    }
 
  //utilisateur inscrit
  if (utilisateur.role === 'Utilisateur_inscrit') {
        console.log(`Update: Modification interdite pour Utilisateur_inscrit ${id}`);
        throw new Error('Modification des Utilisateur_inscrit interdite');
  }
  
   
 //client
  if (utilisateur.role === 'client') {
        console.log(`Update: Modification interdite pour client ${id}`);
        throw new Error('Modificataion des clients interdite');
  }
  
     

  return await utilisateur.update(data);
};


// ✅ Supprimer un utilisateur
const deleteUtilisateur = async (id) => {
  const utilisateur = await Utilisateur.findByPk(id);
  if (!utilisateur) {
    throw new Error('Utilisateur non trouvé');
  }

  // admin
  if (utilisateur.role === 'administrateur') {
        console.log(`Delete: Suppression interdite pour administrateur ${id}`);
            throw new Error('Suppression des administrateurs  interdite');
  }
  //agent 
   if (utilisateur.role === 'agent') {
        const agent = await Agent.findOne({ where: { id: utilisateur.id } });
     if (agent) {
                console.log(`Delete: Agent ${id} supprimé`);            await agent.destroy();
        }
  }
  
   
  //utilisateur inscrit     ==> date depasse 2ans   ==== si il n'a jamais fait de reservation ==>psq il  a une réservation en cours et il a validé devient un client sinon l client ca sera supprimer!
  const deuxAns = 2 * 365 * 24 * 60 * 60 * 1000; // 2 ans en millisecondes
    const maintenant = new Date();
  if (utilisateur.role === 'Utilisateur_inscrit') {
    if (utilisateur.dateDerniereConnexion && (maintenant - utilisateur.dateDerniereConnexion) > deuxAns) {
      const utilisateur_inscrit = await Utilisateur_inscrit.findOne({ where: { id: utilisateur.id } });
      if (utilisateur_inscrit) {
        await utilisateur_inscrit.destroy();
          console.log(`Delete: Utilisateur_inscrit ${id} supprimé pour inactivité > 2 ans`);
      }
    } else {
      console.log(`Delete: Utilisateur_inscrit ${id} non supprimé, dernier accès < 2 ans`);
      throw new Error('Suppression interdite avant 2 ans d\'inactivité');
    }
  }

  //client
   if (utilisateur.role === 'client' ) {
    console.log(`Delete: Suppression interdite pour client ${id}`);
        throw new Error('Suppression des clients  interdite');
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

  utilisateur.dateDerniereConnexion = new Date();
  await utilisateur.save()
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
      role: utilisateur.role,
       dateDerniereConnexion: utilisateur.dateDerniereConnexion
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
