'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('characters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      gold: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      health: {
        type: Sequelize.INTEGER,
        defaultValue: 10
      },
      max_health: {
        type: Sequelize.INTEGER,
        defaultValue: 10
      },
      mana: {
        type: Sequelize.INTEGER,
        defaultValue: 10
      },
      max_mana: {
        type: Sequelize.INTEGER,
        defaultValue: 10
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('characters');
  }
};
