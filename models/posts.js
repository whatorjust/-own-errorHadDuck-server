'use strict';

module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define(
    'Posts',
    {
      postname: { type: DataTypes.STRING, allowNull: false },
      postcode: DataTypes.STRING,
      solution: DataTypes.STRING,
      iscomplete: { type: DataTypes.BOOLEAN, defaultValue: false }
    },
    {}
  );
  Posts.associate = function(models) {
    Posts.belongsTo(models.Users);
    Posts.hasMany(models.Refers);
    Posts.belongsToMany(models.Keywords, {
      through: 'Poskey'
    });
  };
  return Posts;
};
