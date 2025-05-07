'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Commentaire extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
          Commentaire.belongsTo(models.Publication, {
           foreignKey: ' id_publication',
           as: 'publication'
    });    }
  }
  Commentaire.init({
    date_commentaire: DataTypes.DATE,
    contenu: DataTypes.STRING,
    id_publication: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Commentaire',
  });
  return Commentaire;
};