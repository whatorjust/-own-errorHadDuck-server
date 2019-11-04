'use strict';
module.exports = (sequelize, DataTypes) => {
  const Refer = sequelize.define(
    'Refer',
    {
      referurl: DataTypes.STRING,
      understand: DataTypes.STRING
    },
    { charset: 'utf8', collate: 'utf8_general_ci' }
  );

  Refer.associate = function(models) {
    Refer.belongsTo(models.Post);
  };
  return Refer;
};
