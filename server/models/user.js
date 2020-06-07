'use strict';

const bcrypt = require('bcrypt')
const bcryptLevel = process.env.NODE_ENV === 'test' ? 1 : 10

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue('password', bcrypt.hashSync(value, bcryptLevel))
      }
    },
    sessionId: DataTypes.STRING,
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Item, {
      as: 'items',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    })
  }

  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
  }

  return User;
};
