'use strict';

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      postname: { type: DataTypes.STRING, allowNull: false },
      postcode: DataTypes.TEXT,
      solution: DataTypes.TEXT,
      iscomplete: { type: DataTypes.BOOLEAN, defaultValue: false }
    },
    { charset: 'utf8', collate: 'utf8_general_ci' }
  );
  Post.associate = function(models) {
    Post.belongsTo(models.User);
    Post.hasMany(models.Refer, { onDelete: 'CASCADE' });
    Post.hasMany(models.Poskey, { onDelete: 'CASCADE' });
  };
  return Post;
};
