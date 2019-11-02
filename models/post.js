'use strict';

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      postname: { type: DataTypes.STRING, allowNull: false },
      postcode: DataTypes.STRING,
      solution: DataTypes.STRING,
      iscomplete: { type: DataTypes.BOOLEAN, defaultValue: false }
    },
    {}
  );
  Post.associate = function(models) {
    Post.belongsTo(models.User);
    Post.hasMany(models.Refer);
    Post.hasMany(models.Poskey);
  };
  return Post;
};
