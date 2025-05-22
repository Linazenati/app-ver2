'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Utilisateur extends Model {
    static associate(models) {
      Utilisateur.hasMany(models.Agent, {
        foreignKey: 'id', // clé étrangère qui pointe vers Utilisateur
        as: 'agents' // alias pour l'association
      });
      Utilisateur.hasMany(models.Utilisateur_inscrit, {
        foreignKey: 'id', // clé étrangère qui pointe vers Utilisateur
        as: 'utilisateur_inscrits' // alias pour l'association
      });
      Utilisateur.hasOne(models.Administrateur, {
        foreignKey: 'id', // clé étrangère qui pointe vers Utilisateur
        as: 'administrateurs' // alias pour l'association
      });
      Utilisateur.hasMany(models.Client, {
        foreignKey: 'id', // clé étrangère qui pointe vers Utilisateur
        as: 'clients' // alias pour l'association
      });
     
    }
  }

  Utilisateur.init({
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    telephone: DataTypes.INTEGER,
    role: {
<<<<<<< HEAD
      type: DataTypes.ENUM('administrateur', 'client', 'agent', 'Utilisateur_inscrit'),
      allowNull: false,
      defaultValue: 'Utilisateur_inscrit', // Définition du rôle par défaut
=======
      type: DataTypes.ENUM('administrateur', 'client', 'agent','Utilisateur_inscrit'),
      allowNull: false
    },
    dateDerniereConnexion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
>>>>>>> 132de8847958836ba9c8f7be64753e37240aacbc
    }
  }, {
    sequelize,
    modelName: 'Utilisateur',
  });

  return Utilisateur;
};
