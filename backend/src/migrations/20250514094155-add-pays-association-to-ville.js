'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Ajouter la colonne pays_id à la table Villes
    await queryInterface.addColumn(
      'Villes',              // nom de la table cible
      'pays_id',             // nom de la nouvelle colonne
      {
        type: Sequelize.INTEGER,
        allowNull: false,    // ou true si vous autorisez des villes sans pays
      }
    );

    // 2. Ajouter la contrainte de clé étrangère
    await queryInterface.addConstraint(
      'Villes',              // table cible
      {
        fields: ['pays_id'],
        type: 'foreign key',
        name: 'fk_villes_pays',   // nom de la contrainte
        references: {
          table: 'Pays',      // table référencée
          field: 'id',        // colonne référencée
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // ou 'RESTRICT' / 'CASCADE' selon votre logique métier
      }
    );
  },

  async down (queryInterface, Sequelize) {
    // 1. Supprimer la contrainte
    await queryInterface.removeConstraint('Villes', 'fk_villes_pays');

    // 2. Supprimer la colonne
    await queryInterface.removeColumn('Villes', 'pays_id');
  }
};
