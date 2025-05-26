'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vol extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {
      Vol.hasMany(models.Reservation, {
        foreignKey: 'id_vol',
        as: 'vol'
      });
    }
  }
  Vol.init({
    numero_vol: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    compagnie_aerienne: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aeroport_depart: {   // j'ai changé ville_depart en aeroport_depart pour être plus précis
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_depart: {
      type: DataTypes.DATE,
       allowNull: true, // TEMPORAIRE
    },
    aeroport_arrivee: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_arrivee: {
      type: DataTypes.DATE,
       allowNull: true, // TEMPORAIRE
    },
    duree: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    prix: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    devise: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'DZD',
    },
    bagages_inclus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    remboursable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    sequelize,
    modelName: 'Vol',
  });
  return Vol;
};
