'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Omras', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nom: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      prix: {
        type: Sequelize.DECIMAL
      },
      dateDepart: {
        type: Sequelize.DATE
      },
      duree: {
        type: Sequelize.INTEGER
      },
      estPublie: {
        type: Sequelize.BOOLEAN
      },
      status: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Omras');
  }
};