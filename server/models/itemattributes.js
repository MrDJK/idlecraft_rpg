'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemAttributes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ItemAttributes.init({
    item_id: DataTypes.INTEGER,
    attribute: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: 'ItemAttributes',
    tableName: 'item_attributes'
  });
  return ItemAttributes;
};
