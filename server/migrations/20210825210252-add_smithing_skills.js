'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn("user_levels", "smithing_level", {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 1
    })

    await queryInterface.addColumn("user_levels", "smithing_xp", {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
