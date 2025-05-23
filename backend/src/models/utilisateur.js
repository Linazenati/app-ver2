'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Utilisateur extends Model {
    static associate(models) {
      Utilisateur.hasMany(models.Agent, {
        foreignKey: 'id',
        as: 'agents'
      });
      Utilisateur.hasMany(models.Utilisateur_inscrit, {
        foreignKey: 'id',
        as: 'utilisateur_inscrits'
      });
      Utilisateur.hasOne(models.Administrateur, {
        foreignKey: 'id',
        as: 'administrateurs'
      });
      Utilisateur.hasMany(models.Client, {
        foreignKey: 'id',
        as: 'clients'
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
      type: DataTypes.ENUM('administrateur', 'client', 'agent', 'Utilisateur_inscrit'),
      allowNull: false,
      defaultValue: 'Utilisateur_inscrit'
    },
    dateDerniereConnexion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    }
  }, {
    sequelize,
    modelName: 'Utilisateur',
  });

  return Utilisateur;
};
