'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ville extends Model {
    static associate(models) {
      Ville.hasMany(models.Hotel, {
        foreignKey: 'villeId',
        as: 'hotels'
      });
    }
  }

  Ville.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: DataTypes.STRING,
    region: {
  type: DataTypes.ENUM('Monde', 'Algérie', 'Tunisie'),
  allowNull: false
},
    dest_id: DataTypes.STRING
  }, {
      sequelize, // <-- **NE PAS OUBLIER** de passer ici l'instance sequelize
    modelName: 'Ville',
  tableName: 'villes', // <-- ici mettre le nom exact de ta table en base
  freezeTableName: true
  });
  return Ville;
};
