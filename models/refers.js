'use strict';
module.exports = (sequelize, DataTypes) => {
  const Refers = sequelize.define(
    'Refers',
    {
      referurl: DataTypes.STRING,
      understand: DataTypes.STRING
    },
    {}
  );

  Refers.associate = function(models) {
    Refers.belongsTo(models.Posts);
  };
  return Refers;
};
