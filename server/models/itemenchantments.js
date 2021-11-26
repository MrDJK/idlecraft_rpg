'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemEnchantments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ItemEnchantments.init({
    item_id: DataTypes.INTEGER,
    enchantment_name: DataTypes.STRING,
    enchantment_strength: DataTypes.INTEGER,
  }, {
    sequelize,
    createdAt: false,
    updatedAt: false,
    modelName: 'ItemEnchantments',
    tableName: 'item_enchantments'
  });
  return ItemEnchantments;
};
