'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UnlockedLocations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UnlockedLocations.init({
    user_id: DataTypes.INTEGER,
    location: DataTypes.INTEGER,
    ticks: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UnlockedLocations',
    tableName: 'unlocked_locations'
  });
  return UnlockedLocations;
};
