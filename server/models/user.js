'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Characters, {
        foreignKey: 'user_id',
        sourceKey: 'id'
      })
    }
  };
  User.init({
    login_name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    staff: DataTypes.INTEGER,
    muted: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });

  return User;
};
