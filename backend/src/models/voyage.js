'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Voyage extends Model {
    static associate(models) {
      Voyage.belongsTo(models.Agent, {
        foreignKey: 'id_agent',
        as: 'agent'
      });
      Voyage.hasMany(models.Publication, {
        foreignKey: 'id_voyage',
        as: 'publications'
      });
    }
  }

  Voyage.init({
    titre: DataTypes.STRING,
    description: DataTypes.TEXT,
    date_de_depart: DataTypes.DATEONLY, // Choix retenu pour une date sans heure
    date_de_retour: DataTypes.DATEONLY,
    prix: DataTypes.FLOAT, // Plus flexible pour les prix
    statut: {
      type: DataTypes.ENUM('disponible', 'épuisé'),
      defaultValue: 'disponible'
    },
    plateforme: DataTypes.TEXT,
    est_publier: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    image: DataTypes.STRING,
    id_agent: DataTypes.INTEGER,
    programme: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    excursions: {
      type: DataTypes.JSON,
      defaultValue: []
    }
  }, {
    sequelize,
    modelName: 'Voyage',
    tableName: 'Voyages',
  });

  return Voyage;
};
