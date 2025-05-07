'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Paiements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      devise: {
        type: Sequelize.STRING
      },
      methode_paiement: {
        type: Sequelize.STRING
      },
      statut: {
        type: Sequelize.STRING
      },
      lien_paiement: {
        type: Sequelize.STRING
      },
      id_reservation: {
       type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Reservations',      // assure-toi que ta table Agents s’appelle bien "Agents"
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
    await queryInterface.dropTable('Paiements');
  }
};