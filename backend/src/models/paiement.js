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
     Paiement.belongsTo(models.Assurance, {
    foreignKey: 'id_assurance',
    as: 'assurance' // ✅ alias pour accéder à l'assurance liée à un paiement
  });

  
   Paiement.belongsTo(models.Visa, {
        foreignKey: 'id_visa',
        as: 'visa' // alias pour accéder au visa lié à un paiement
      });
    }
  }
  Paiement.init({
    devise: DataTypes.STRING,
    methode_paiement: DataTypes.STRING,
    statut: DataTypes.STRING,
    lien_paiement: DataTypes.STRING,
     id_assurance: DataTypes.INTEGER,
    id_reservation: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Paiement',
  });
  return Paiement;
};