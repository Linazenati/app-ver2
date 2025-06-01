'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Participant extends Model {
    static associate(models) {
      Participant.belongsTo(models.Visa, {
        foreignKey: 'visaId',
        as: 'visa',
      });

      Participant.hasMany(models.Justificatif, {
        foreignKey: 'participantId',
        as: 'justificatifs',
        onDelete: 'CASCADE',
      });
    }
  }

  Participant.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    prenom: DataTypes.STRING,
    nom: DataTypes.STRING,
    dateNaissance: DataTypes.DATEONLY,
    lieuNaissance: DataTypes.STRING,
    numeroPasseport: DataTypes.STRING,
    delivrancePasseport: DataTypes.DATEONLY,
    expirationPasseport: DataTypes.DATEONLY,
    email: DataTypes.STRING,
    adresse: DataTypes.STRING,
    visaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Participant',
  });

  return Participant;
};
