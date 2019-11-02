'use strict';
module.exports = (sequelize, DataTypes) => {
  const Poskey = sequelize.define(
    'Poskey',
    {
      poskey: DataTypes.STRING
    },
    {}
  );
  Poskey.associate = function(models) {
    Poskey.belongsTo(models.Post);
    Poskey.belongsTo(models.Keyword);
  };
  return Poskey;
};
