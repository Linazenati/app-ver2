'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Assurance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
  Assurance.belongsTo(models.Utilisateur_inscrit, {
     
    foreignKey: 'id_utilisateur_inscrit',
    
    as: 'utilisateur_inscrit'
  });
  Assurance.hasMany(models.Paiement, {
    foreignKey: 'id_assurance',
    as: 'paiements' // ✅ alias pour accéder à tous les paiements liés à une assurance
  });
}
  }
  Assurance.init({
    description: DataTypes.TEXT,
    prix: DataTypes.FLOAT,
    dateDebut: DataTypes.DATE,
    dateFin: DataTypes.DATE,
    nombreVoyageurs: DataTypes.INTEGER,
    passeportScan: DataTypes.JSON,
    type: {
      type: DataTypes.ENUM,
      values: ['annulation', 'medicale', 'bagages', 'responsabilite', 'multirisque'],
      allowNull: false,
      validate: {
        isIn: [['annulation', 'medicale', 'bagages', 'responsabilite', 'multirisque']]
      }
    }
  }, {
    sequelize,
    modelName: 'Assurance',
  });
  return Assurance;
};