'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vol extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
Vol.hasMany(models.Reservation,
        {
          foreignKey: ' id_vol',
          as: 'vol'});  // clé étrangère 
      }
  }
  Vol.init({
    numero_vol: DataTypes.STRING,
    compagnie_aerienne: DataTypes.STRING,
    ville_depart: DataTypes.STRING,
    ville_arrivee: DataTypes.STRING,
    prix: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Vol',
  });
  return Vol;
};