'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Publications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date_publication: {
        type: Sequelize.DATE
      },
      plateforme: {
        type: Sequelize.STRING
      },
      statut: {
        type: Sequelize.STRING
      },
      id_voyage: {
         type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Voyages',   // assure-toi que ta table Agents s’appelle bien "Agents"
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
      },


      id_omra: {
        type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Omras',   // assure-toi que ta table Agents s’appelle bien "Agents"
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
      },


      id_post_facebook: {
        type: Sequelize.INTEGER
      },
      id_post_instagram: {
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
    await queryInterface.dropTable('Publications');
  }
};