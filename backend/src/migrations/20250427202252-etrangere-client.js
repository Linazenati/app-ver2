'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // 1) Supprime la contrainte FK existante sur Clients.id
    //    Le nom de la contrainte peut varier : 
    //    si tu ne l'as pas nommé toi-même, regarde dans phpMyAdmin ou fais SHOW CREATE TABLE Clients;
    await queryInterface.removeConstraint('Clients', 'clients_ibfk_1');

    // 2) Change la colonne id pour qu'elle référence Utilisateur_inscrits.id
    await queryInterface.changeColumn('Clients', 'id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      references: {
        model: 'utilisateur_inscrits',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    // Pour revenir en arrière : supprime la FK vers inscrit…
    await queryInterface.removeConstraint('Clients', 'fk_utilisateur_utilisateurinscrit');

    // …et remets la FK vers Utilisateurs
    await queryInterface.changeColumn('Clients', 'id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      references: {
        model: 'Utilisateurs',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
};
