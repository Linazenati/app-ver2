'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VoyageOrganise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        VoyageOrganise.belongsTo(models.Agent, {
        foreignKey: 'id_agent',
        as: 'agent' // Alias pour accéder à l'agent du voyage
      });


}
  }

  VoyageOrganise.init({
    titre: DataTypes.STRING,
    description: DataTypes.TEXT,
    date_de_depart: DataTypes.DATE,
    destination: DataTypes.STRING,
    prix: DataTypes.FLOAT,
    statut: DataTypes.STRING,
    plateforme: DataTypes.STRING,
    image: DataTypes.STRING,
    estPublie: DataTypes.BOOLEAN,// Ajout du champ estPublie ici
    id_agent: DataTypes.INTEGER,
    facebook_post_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  instagram_post_id: {
    type: DataTypes.STRING,
    allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'VoyageOrganise',
  });
  return VoyageOrganise;
};