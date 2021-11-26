'use strict';
const xpTable = require("../config/xpTable");
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserLevels extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserLevels.init({
    user_id: DataTypes.INTEGER,
    woodcutting_level: DataTypes.INTEGER,
    woodcutting_xp: DataTypes.BIGINT,
    mining_level: DataTypes.INTEGER,
    mining_xp: DataTypes.BIGINT,
    crafting_level: DataTypes.INTEGER,
    crafting_xp: DataTypes.BIGINT,
    fishing_level: DataTypes.INTEGER,
    fishing_xp: DataTypes.BIGINT,
    smithing_level: DataTypes.INTEGER,
    smithing_xp: DataTypes.BIGINT,
    combat_level: DataTypes.INTEGER,
    combat_xp: DataTypes.BIGINT,
    adventuring_level: DataTypes.INTEGER,
    adventuring_xp: DataTypes.BIGINT,
    cooking_level: DataTypes.INTEGER,
    cooking_xp: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'UserLevels',
    tableName: 'user_levels',
    hooks: {
      beforeSave(instance, options) {
        const changed = instance.changed();
        for (let i = 0; i < changed.length; i++) {
          const field = changed[i]; // woodcutting_xp

          if (field.includes('xp')) {
            const level = field.replace('_xp', '_level'); // woodcutting_level
            const currentLevel = instance[level];
            const currentXp = instance[field];

            if(currentXp >= xpTable[currentLevel]) {
              instance[level] += 1;
            }
          }
        }
      }
    }
  });
  return UserLevels;
};
