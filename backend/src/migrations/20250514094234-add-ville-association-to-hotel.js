'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Ajouter la colonne ville_id à la table Hotels
    await queryInterface.addColumn(
      'Hotels',
      'ville_id',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    );

    // 2. Ajouter la contrainte de clé étrangère
    await queryInterface.addConstraint(
      'Hotels',
      {
        fields: ['ville_id'],
        type: 'foreign key',
        name: 'fk_hotels_ville',
        references: {
          table: 'Villes',
          field: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Hotels', 'fk_hotels_ville');
    await queryInterface.removeColumn('Hotels', 'ville_id');
  }
};
