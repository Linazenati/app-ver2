'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ApiConfig extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ApiConfig.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    apiKey: DataTypes.STRING,
    apiSecret: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ApiConfig',
  });
  return ApiConfig;
};