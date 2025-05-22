'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Villes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        references: {
        model: 'Pays',
        key: 'pays_id'
        },      },
      nom: {
        type: Sequelize.STRING
      },
      region: {
        type: Sequelize.STRING
      },
      longitude: {
        type: Sequelize.FLOAT
      },
      latitude: {
        type: Sequelize.FLOAT
      },
      pays_id: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Villes');
  }
};