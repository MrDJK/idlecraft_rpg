'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Relationships extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.hasOne(models.Characters, {
      //   foreignKey: 'id',
      //   sourceKey: 'user_id',
      //   as: 'initiator'
      // })

      console.log({models})

      this.hasOne(models.Characters, {
        foreignKey: 'id',
        sourceKey: 'user_id',
        as: 'other_user'
      })
    }
  };
  Relationships.init({
    user_id: DataTypes.INTEGER,
    other_user_id: DataTypes.INTEGER,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Relationships',
    tableName: 'relationships',
  });
  return Relationships;
};
