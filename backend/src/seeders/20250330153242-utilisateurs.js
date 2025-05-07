'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    let utilisateurs = [];

    for (let i = 0; i < 50; i++) {
      utilisateurs.push({
        nom: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: faker.helpers.arrayElement(['client', 'agent', 'admin']), // tu peux ajuster selon tes besoins
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('utilisateurs', utilisateurs, {}); // 👈 ici le nom de la table doit correspondre
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('utilisateurs', null, {});
  }
};
