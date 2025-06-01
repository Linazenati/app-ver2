'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Publication extends Model {
    static associate(models) {
      // Publication appartient à un Voyage
      Publication.belongsTo(models.Voyage, {
        foreignKey: 'id_voyage',
        as: 'voyage',
      });

      // Publication appartient à une Omra
      Publication.belongsTo(models.Omra, {
        foreignKey: 'id_omra',
        as: 'omra',
      });

      // Une publication a plusieurs commentaires
      Publication.hasMany(models.Commentaire, {
        foreignKey: 'id_publication',
        as: 'commentaire'
      });

      // Une publication a plusieurs réservations
      Publication.hasMany(models.Reservation, {
        foreignKey: 'id_publication',
        as: 'reservation'
      });
    }
  }

  Publication.init({
    date_publication: DataTypes.DATE,

    plateforme: {
      type: DataTypes.ENUM('site', 'facebook', 'instagram', 'tiktok'),
      allowNull: false
    },

    statut: {
      type: DataTypes.ENUM('disponible', 'épuisé'),
      defaultValue: 'disponible'
    },

    id_voyage: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    id_omra: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    id_post_facebook: {
      type: DataTypes.STRING,
      allowNull: true
    },

    id_post_instagram: {
      type: DataTypes.STRING,
      allowNull: true
    },

    url_post: {
      type: DataTypes.STRING,
      allowNull: true
    } , 
    nbr_likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    date_maj_likes: {
      type: DataTypes.DATE,
       allowNull: true,
  },
  }, {
    sequelize,
    modelName: 'Publication',
  });

  return Publication;
};
