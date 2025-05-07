'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vols', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      numero_vol: {
        type: Sequelize.STRING
      },
      compagnie_aerienne: {
        type: Sequelize.STRING
      },
      ville_depart: {
        type: Sequelize.STRING
      },
      ville_arrivee: {
        type: Sequelize.STRING
      },
      prix: {
        type: Sequelize.DECIMAL
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Vols');
  }
};