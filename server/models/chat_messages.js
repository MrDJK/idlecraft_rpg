'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chat_messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.hasOne(models.Characters, {
        foreignKey: 'id',
        sourceKey: 'user_id'
      });
    }
  };
  chat_messages.init({
    user_id: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'chat_messages',
  });
  return chat_messages;
};
