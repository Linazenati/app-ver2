'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voyage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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
    date_de_depart: DataTypes.DATEONLY,
    date_de_retour: DataTypes.DATEONLY,
    prix: DataTypes.FLOAT,
    statut:  {
      type: DataTypes.ENUM('disponible', 'épuisé'),
      defaultValue: 'disponible'
    },
    plateforme:  DataTypes.TEXT,
    est_publier: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    },
   
  },
  
  
    
    {
    sequelize,
    modelName: 'Voyage',
  });
  return Voyage;
};