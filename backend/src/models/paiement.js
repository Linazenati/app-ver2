'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Paiement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Paiement.belongsTo(models.Reservation, {
    foreignKey: 'id_reservation',
    as: 'reservation'
    });
    }
  }
  Paiement.init({
    devise: DataTypes.STRING,
    methode_paiement: DataTypes.STRING,
    statut: DataTypes.STRING,
    lien_paiement: DataTypes.STRING,
    id_reservation: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Paiement',
  });
  return Paiement;
};