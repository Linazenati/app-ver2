'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VoyageOrganises', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titre: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      date_de_depart: {
        type: Sequelize.DATE
      },
      destination: {
        type: Sequelize.STRING
      },
      prix: {
        type: Sequelize.FLOAT
      },
      statut: {
        type: Sequelize.STRING
      },
      plateforme: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      estPublie: {  // Ajoute ce champ
        type: Sequelize.BOOLEAN,
        defaultValue: false,  // Par défaut, non publié
      },
      
      facebook_post_id: {
         type: Sequelize.STRING,
         allowNull: true,
        unique: true
        },
        instagram_post_id: {
         type: Sequelize.STRING,
           allowNull: true,
           unique: true
           },

      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('VoyageOrganises');
  }
};