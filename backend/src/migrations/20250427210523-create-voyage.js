'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Voyages', {
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
      date_de_retour: {
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
      est_publier: {
        type: Sequelize.BOOLEAN
      },
      image: {
        type: Sequelize.STRING
      },
      id_agent: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Agents',   // assure-toi que ta table Agents s’appelle bien "Agents"
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
    await queryInterface.dropTable('Voyages');
  }
};