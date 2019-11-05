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
    { charset: 'utf8', collate: 'utf8_general_ci' }
  );
  Post.associate = function(models) {
    Post.belongsTo(models.User);
    Post.hasMany(models.Refer, { onDelete: 'cascade' });
    Post.hasMany(models.Poskey, { onDelete: 'cascade' });
  };
  return Post;
};
