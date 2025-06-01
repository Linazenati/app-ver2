'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quota extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Quota.init({
    date: DataTypes.DATEONLY,
    minute_utilisee: DataTypes.INTEGER,
    heure_utilisee: DataTypes.INTEGER,
    jour_utilisee: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Quota',
  });
  return Quota;
};