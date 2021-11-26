'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Character extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.UserLevels, {
        foreignKey: 'user_id',
        sourceKey: 'id'
      });

      this.hasMany(models.UserInventory, {
        foreignKey: 'user_id',
        sourceKey: 'id'
      });

      this.hasMany(models.UnlockedLocations, {
        foreignKey: 'user_id',
        sourceKey: 'id'
      });

      this.hasOne(models.User, {
        foreignKey: 'id',
        sourceKey: 'user_id'
      });

      this.hasMany(models.Relationships, {
        foreignKey: 'user_id',
        sourceKey: 'user_id'
      })
    }
  };
  Character.init({
    user_id: DataTypes.INTEGER,
    gold: DataTypes.INTEGER,
    health: DataTypes.INTEGER,
    max_health: DataTypes.INTEGER,
    mana: DataTypes.INTEGER,
    max_mana: DataTypes.INTEGER,
    premium: DataTypes.DATE,
    badge: DataTypes.STRING,
    mc_head: DataTypes.STRING,
    title: DataTypes.STRING,
    username: DataTypes.STRING,
    current_skill: DataTypes.INTEGER,
    session_ends: DataTypes.DATE,
    skin: DataTypes.STRING,
    heat: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'Characters',
    tableName: 'characters',
  });
  return Character;
};
