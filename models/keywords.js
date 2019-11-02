'use strict';
module.exports = (sequelize, DataTypes) => {
  const Keywords = sequelize.define(
    'Keywords',
    {
      keyword: DataTypes.STRING
    },
    {}
  );
  Keywords.associate = function(models) {
    Keywords.belongsToMany(models.Posts, {
      through: 'Poskey'
    });
  };
  return Keywords;
};
