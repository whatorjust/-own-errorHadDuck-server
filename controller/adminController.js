const models = require('../models');

module.exports = {
  truncate: function(req, res) {
    console.log('try truncate');
    try {
      models.sequelize
        .query('SET FOREIGN_KEY_CHECKS = 0')
        .then(() => {
          models.sequelize.sync({ force: true });
        })
        .then(() => {
          models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        })
        .then(result => {
          if (result) {
            res.status(200).send({ msg: 'truncated' });
          }
        })
        .catch(err => {
          res.json({ isError: true, status: err.message });
        });
    } catch (err) {
      res.sendStatus(500);
    }
  }
};
