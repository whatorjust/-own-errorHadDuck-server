'use strict';
module.exports = (sequelize, DataTypes) => {
  const Refer = sequelize.define(
    'Refer',
    {
      referurl: DataTypes.STRING,
      understand: DataTypes.STRING
    },
    {}
  );

  Refer.associate = function(models) {
    Refer.belongsTo(models.Post);
  };
  return Refer;
};
