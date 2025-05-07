'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reservations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date_reservation: {
        type: Sequelize.DATE
      },
      statut: {
        type: Sequelize.STRING
      },
      id_utilisateur_inscrit: {
       type: Sequelize.INTEGER,
       allowNull: false,
       references: {
          model: 'utilisateur_inscrits', // assure-toi que ta table Agents s’appelle bien "Agents"
       key: 'id'
          },
        onUpdate: 'CASCADE',
         onDelete: 'CASCADE'
      },
      id_publication: {
        type: Sequelize.INTEGER,
       allowNull: false,
       references: {
          model: 'Publications', // assure-toi que ta table Agents s’appelle bien "Agents"
       key: 'id'
          },
        onUpdate: 'CASCADE',
         onDelete: 'CASCADE'
      },
      id_vol: {
       type: Sequelize.INTEGER,
       allowNull: false,
       references: {
          model: 'Vols', // assure-toi que ta table Agents s’appelle bien "Agents"
       key: 'id'
          },
        onUpdate: 'CASCADE',
         onDelete: 'CASCADE'
      },
      id_hotel: {
       type: Sequelize.INTEGER,
       allowNull: false,
       references: {
          model: 'Hotels', // assure-toi que ta table Agents s’appelle bien "Agents"
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
    await queryInterface.dropTable('Reservations');
  }
};