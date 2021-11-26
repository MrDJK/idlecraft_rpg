'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_levels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'users',
          }
        }
      },
      woodcutting_level: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      woodcutting_xp: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
      },
      mining_level: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      mining_xp: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
      },
      crafting_level: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      crafting_xp: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
      },
      fishing_level: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      fishing_xp: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
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
    await queryInterface.dropTable('user_levels');
  }
};
