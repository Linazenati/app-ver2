'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     Reservation.belongsTo(models.Publication, {
      foreignKey: ' id_publication',
       as: 'publication', // Alias pour accéder à la relation dans le code
     });
       Reservation.belongsTo(models.Utilisateur_inscrit, {
      foreignKey: ' id_utilisateur_inscrit',
       as: 'utilisateur_inscrit', // Alias pour accéder à la relation dans le code
       });
       Reservation.belongsTo(models.Vol, {
      foreignKey: ' id_vol',
       as: 'vol', // Alias pour accéder à la relation dans le code
       });
       Reservation.belongsTo(models.Hotel, {
      foreignKey: ' id_hotel',
       as: 'hotel', // Alias pour accéder à la relation dans le code
       });
       Reservation.hasOne(models.Paiement, {
      foreignKey: ' id_reservation',
       as: 'reservation', // Alias pour accéder à la relation dans le code
     });
    }
  }
  Reservation.init({
    date_reservation: DataTypes.DATE,
    statut: DataTypes.STRING,
    id_utilisateur_inscrit: DataTypes.INTEGER,
    id_publication: DataTypes.INTEGER,
    id_vol: DataTypes.INTEGER,
    id_hotel: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reservation',
  });
  return Reservation;
};