'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn("characters", "heat", {
      type: Sequelize.DataTypes.BIGINT,
      defaultValue: 0
    });

    // Can the item be put in the combat inventory?
    await queryInterface.addColumn("items", "combat_inventory", {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
    })

    await queryInterface.addColumn("items", "description", {
      type: Sequelize.DataTypes.STRING,
      defaultValue: null,
    })

    // Is the item in the combat inventory?
    await queryInterface.addColumn("user_inventory", "combat_inventory", {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
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
