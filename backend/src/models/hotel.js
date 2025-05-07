'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hotel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    Hotel.hasMany(models.Reservation,
        {
          foreignKey: ' id_hotel',
          as: 'hotel'});  // clé étrangère 
  
    }
  }
  Hotel.init({
    nom: DataTypes.STRING,
    adresse: DataTypes.STRING,
    ville: DataTypes.STRING,
    prix_par_nuit: DataTypes.DECIMAL,
    date_disponibilite: DataTypes.DATE,
    photo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Hotel',
  });
  return Hotel;
};