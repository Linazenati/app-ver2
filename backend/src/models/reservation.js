'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    static associate(models) {
      Reservation.belongsTo(models.Publication, {
        foreignKey: 'id_publication',
        as: 'publication',
      });

      Reservation.belongsTo(models.Utilisateur_inscrit, {
        foreignKey: 'id_utilisateur_inscrit',
        as: 'utilisateur_inscrit',
      });
      Reservation.belongsTo(models.Vol, {
        foreignKey: 'id_vol',
        as: 'vol',
      });
      Reservation.belongsTo(models.Hotel, {
        foreignKey: 'id_hotel',
        as: 'hotel',
      });
      Reservation.hasOne(models.Paiement, {
        foreignKey: 'id_reservation',
        as: 'reservation',
      });
    }
  }

  Reservation.init({

    statut: {
      type: DataTypes.ENUM('en attente', 'confirmée', 'annulée', 'terminée'),
      allowNull: false,
      defaultValue: 'en attente'
    },
    id_utilisateur_inscrit: DataTypes.INTEGER,
    id_publication: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_vol: DataTypes.INTEGER,
    id_hotel: DataTypes.INTEGER,

    // Champs ajoutés
    date_depart: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    date_retour: {
      
      type: DataTypes.DATE,
      allowNull: true, // Omra peut ne pas avoir de retour
    },
    nombre_adultes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombre_enfants: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type_chambre: {
      type: DataTypes.ENUM('Single', 'Double', 'Triple'),
      allowNull: true,
    },

    ville_residence: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nationalite: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    piece_identite: {
      type: DataTypes.STRING, // nom ou chemin du fichier
      allowNull: true,
    },
    passeport: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Reservation',
  });

  return Reservation;
};
