'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Justificatif extends Model {
    static associate(models) {
      Justificatif.belongsTo(models.Participant, {
        foreignKey: 'participantId',
        as: 'participant',
      });
    }
  }

  Justificatif.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    filename: DataTypes.STRING,
    originalName: DataTypes.STRING,
    mimeType: DataTypes.STRING,
    participantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Justificatif',
  });

  return Justificatif;
};
