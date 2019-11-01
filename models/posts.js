'use strict';
module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define(
    'Posts',
    {
      userid: DataTypes.INTEGER,
      postname: { type: DataTypes.STRING, allowNull: true },
      postcode: DataTypes.STRING,
      solution: DataTypes.STRING,
      iscomplete: { type: DataTypes.BOOLEAN, defaultValue: false }
    },
    {}
  );
  Posts.associate = function(models) {
    Posts.belongsTo(models.Users, {
      foreignKey: 'userid'
    });
  };
  return Posts;
};
