'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Omra extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Omra.belongsTo(models.Agent, {
        foreignKey: 'id_agent',
        as: 'agent'
      });
      Omra.hasMany(models.Publication, {
        foreignKey: 'id_omra', // Clé étrangère dans Publication
        as: 'publications' // Nom de l'association
      });
    }


  }
  Omra.init({
    titre: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING,
    prix: DataTypes.INTEGER,
    
    date_de_depart: DataTypes.DATEONLY,
    date_de_retour: DataTypes.DATEONLY,
    duree: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('disponible', 'épuisé'),
      defaultValue: 'disponible'
    },
    image: {
      type: DataTypes.STRING, allowNull: true
    }, // ou false si c'est obligatoire
    est_publier: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    id_agent: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }

  }, {
    sequelize,
    modelName: 'Omra',
  });
  return Omra;
};