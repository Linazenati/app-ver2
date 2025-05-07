'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Commentaires', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date_commentaire: {
        type: Sequelize.DATE
      },
      contenu: {
        type: Sequelize.STRING
      },
      
      id_publication: {
        type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Publications',      // assure-toi que ta table Agents s’appelle bien "Agents"
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
    await queryInterface.dropTable('Commentaires');
  }
};