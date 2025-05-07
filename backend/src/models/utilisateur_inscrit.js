'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Utilisateur_inscrit extends Model {
    
  static associate(models) {
      Utilisateur_inscrit.belongsTo(models.Utilisateur,
        {
          foreignKey: 'id',
          as: 'utilisateur'});  // clé étrangère 
         
    Utilisateur_inscrit.hasOne(models.Client,
      {
        foreignKey: 'id',
        as: 'client'
      }
    );
    Utilisateur_inscrit.hasMany(models.Reservation,
        {
          foreignKey: ' id_utilisateur_inscrit',
          as: 'reservation'});  // clé étrangère 
  
  }
  }
  Utilisateur_inscrit.init({
    adresse: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Utilisateur_inscrit',
  });
  return Utilisateur_inscrit;
};