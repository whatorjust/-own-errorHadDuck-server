'use strict';
module.exports = (sequelize, DataTypes) => {
  const Keyword = sequelize.define(
    'Keyword',
    {
      keyword: DataTypes.STRING
    },
    {}
  );
  Keyword.associate = function(models) {
    Keyword.hasMany(models.Poskey);
  };
  return Keyword;
};
