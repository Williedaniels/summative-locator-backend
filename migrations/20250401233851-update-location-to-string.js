'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Events', 'location', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Events', 'location', {
      type: Sequelize.GEOMETRY('POINT'), // Revert to GEOMETRY if needed
      allowNull: false,
    });
  },
};