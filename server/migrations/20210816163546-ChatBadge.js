'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn("characters", "premium", {
      type: Sequelize.DataTypes.DATE,
      defaultValue: null
    });

    await queryInterface.addColumn("characters", "badge", {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    })

    await queryInterface.addColumn("characters", "mc_head", {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    })

    await queryInterface.addColumn("characters", "title", {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    })

    await queryInterface.addColumn("characters", "username", {
      type: Sequelize.DataTypes.STRING,
    })

    await queryInterface.addColumn("users", "staff", {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    })

    await queryInterface.addColumn("users", "muted", {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
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
