'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Item.init({
    name: DataTypes.STRING,
    tradable: DataTypes.BOOLEAN,
    sockets: DataTypes.TINYINT,
    image: DataTypes.STRING,
    attack: DataTypes.INTEGER,
    defense: DataTypes.INTEGER,
    speed: DataTypes.FLOAT,
    armor_penetration: DataTypes.FLOAT,
    equippable: DataTypes.BOOLEAN,
    equip_slot: DataTypes.STRING,
    type: DataTypes.STRING,
    can_eat: DataTypes.BOOLEAN,
    health_given: DataTypes.INTEGER,
    can_open: DataTypes.BOOLEAN,
    can_sell: DataTypes.BOOLEAN,
    value: DataTypes.INTEGER,
    heat: DataTypes.INTEGER,
    staff: DataTypes.BOOLEAN,
    combat_inventory: DataTypes.BOOLEAN,
    description: DataTypes.STRING,
    stackable: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Item',
    tableName: 'items',
  });

  Item.getImage = function() {
    return Item.name.replace(/[^\w\s]/gi, '').toLowerCase().split(' ').join('-')
  }

  return Item;
};
