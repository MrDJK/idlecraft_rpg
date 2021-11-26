'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      tradable: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      sockets: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
      },
      attack: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      defense: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      speed: {
        type: Sequelize.FLOAT,
        defaultValue: 0.3
      },
      armor_penetration: {
        type: Sequelize.FLOAT,
        defaultValue: 0.05
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      type: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('items');
  }
};
