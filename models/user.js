'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: { type: DataTypes.STRING, unique: true, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false }
    },
    { charset: 'utf8', collate: 'utf8_general_ci' }
  );
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Post, { onDelete: 'CASCADE' });
  };
  return User;
};
