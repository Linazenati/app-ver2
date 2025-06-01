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
    id_publication: DataTypes.INTEGER,
    id_commentaire_instagram: {  // Nouvelle colonne pour stocker l'ID Instagram du commentaire
      type: DataTypes.STRING,
      allowNull: true,
    },
    id_commentaire_facebook: {  // Nouvelle colonne pour stocker l'ID Instagram du commentaire
      type: DataTypes.STRING,
      allowNull: true,
    },
    est_selectionne: {         // <-- ta colonne sélection
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    },
  est_nouveau: {
    type: DataTypes.BOOLEAN,
    defaultValue: true // Nouveau commentaire par défaut
    }
  
  
  }, {
    sequelize,
    modelName: 'Commentaire',
  });
  return Commentaire;
};