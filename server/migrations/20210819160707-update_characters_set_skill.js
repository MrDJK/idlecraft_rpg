'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn("characters", "current_skill", {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: null
    })
    await queryInterface.addColumn("characters", "session_ends", {
      type: Sequelize.DataTypes.DATE,
      defaultValue: null,
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
