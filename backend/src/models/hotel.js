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
        // Relation avec Ville
         Hotel.belongsTo(models.Ville, {
        foreignKey: 'villeId',
        as: 'villes'
      });

        Hotel.hasMany(models.Reservation,
        {
            foreignKey: ' id_hotel',
          as: 'hotel'
        });  // clé étrangère 
    
      } 
    }
  Hotel.init({
     id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
   name: DataTypes.STRING,
    ville: DataTypes.STRING,
    region: DataTypes.STRING,
    adresse: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    etoiles: DataTypes.INTEGER,
photos: {
  type: DataTypes.JSON, // ✅ PAS STRING
  allowNull: true
    },
    Note_moyenne: DataTypes.FLOAT,
    Appréciation: DataTypes.STRING,
    Nombre_avis: DataTypes.INTEGER,
    
    // ✅ Ajout des prix
  prix_euro: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  prix_dinare: {
    type: DataTypes.FLOAT,
    allowNull: true
    },
  villeId: { // ✅ Clé étrangère vers Ville
      type: DataTypes.INTEGER,
      allowNull: false
    }

   
  }, {
    sequelize,
    modelName: 'Hotel',
  });
  return Hotel;
};