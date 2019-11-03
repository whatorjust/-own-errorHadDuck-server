'use strict';
module.exports = (sequelize, DataTypes) => {
  const Poskey = sequelize.define(
    'Poskey',
    {
      poskey: DataTypes.STRING
    },
    { charset: 'utf8', collate: 'utf8_general_ci' }
  );
  Poskey.associate = function(models) {
    Poskey.belongsTo(models.Post);
    Poskey.belongsTo(models.Keyword);
  };
  return Poskey;
};
