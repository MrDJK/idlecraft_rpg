'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn("items", "can_eat", {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addColumn("items", "health_given", {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: false,
    });

    await queryInterface.addColumn("items", "can_open", {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addColumn("items", "can_sell", {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addColumn("items", "value", {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: false,
    });

    await queryInterface.addColumn("items", "heat", {
      type: Sequelize.DataTypes.BIGINT,
      defaultValue: 0,
    });

    await queryInterface.addColumn("items", "staff", {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
    });


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
