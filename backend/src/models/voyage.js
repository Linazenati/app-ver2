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
       Voyage.hasMany(models.Voyage, {
    foreignKey: 'id_voyage',
    as: 'voyage'
       });
      
    }
  }
  Voyage.init({
    titre: DataTypes.STRING,
    description: DataTypes.TEXT,
    date_de_depart: DataTypes.DATE,
    date_de_retour: DataTypes.DATE,
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
    id_agent: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Voyage',
  });
  return Voyage;
};