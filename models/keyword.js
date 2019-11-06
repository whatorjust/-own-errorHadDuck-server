'use strict';
module.exports = (sequelize, DataTypes) => {
  const Keyword = sequelize.define(
    'Keyword',
    {
      keyword: DataTypes.STRING
    },
    { charset: 'utf8', collate: 'utf8_general_ci' }
  );
  Keyword.associate = function(models) {
    Keyword.hasMany(models.Poskey, { onDelete: 'CASCADE' });
  };
  return Keyword;
};
