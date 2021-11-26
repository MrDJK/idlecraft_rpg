'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserInventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Item, {
        foreignKey: 'id',
        sourceKey: 'item_id'
      });

      this.hasMany(models.ItemEnchantments, {
        foreignKey: 'item_id',
        sourceKey: 'id'
      })

      this.hasMany(models.ItemAttributes, {
        foreignKey: 'item_id',
        sourceKey: 'id'
      })
    }
  };

  UserInventory.init({
    user_id: DataTypes.INTEGER,
    item_id: DataTypes.INTEGER,
    amount: DataTypes.BIGINT,
    equipped: DataTypes.BOOLEAN,
    combat_inventory: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'UserInventory',
    tableName: 'user_inventory',
  });

  return UserInventory;
};
