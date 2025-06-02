'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Visa extends Model {
    static associate(models) {
      Visa.hasMany(models.Participant, {
        foreignKey: 'visaId',
        as: 'participants',
        onDelete: 'CASCADE',
      });
        
         // Visa appartient à Utilisateur_inscrit
      Visa.belongsTo(models.Utilisateur_inscrit, {
        foreignKey: 'utilisateurInscritId',
        as: 'utilisateurInscrit',
        allowNull: false
      });
         Visa.hasMany(models.Paiement, {
        foreignKey: 'id_visa',
        as: 'paiements' // alias pour accéder aux paiements liés à un visa
      });

      
    }
  }

  Visa.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pays: {
    type: DataTypes.ENUM,
    values: [
      'France',
      'Canada',
      'États-Unis',
      'Maroc',
      'Turquie',
      'Allemagne',
      'Italie',
      'Espagne',
      'Qatar',
      'Egypte',
      'Thailande',
      'Vietnam',
      'Azerbaïdjan'
    ],
    allowNull: false
  },
  typeVisa: {
    type: DataTypes.ENUM,
    values: ['Tourisme', 'Affaires', 'Etudes'],
    allowNull: false
  },
    personnes: DataTypes.INTEGER,
    nationalite: DataTypes.STRING,
    dateArrivee: DataTypes.DATEONLY,
      accepteConditions: DataTypes.BOOLEAN,
      total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    utilisateurInscritId: {     // clé étrangère vers Utilisateur_inscrit
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Visa',
  });

  return Visa;
};
