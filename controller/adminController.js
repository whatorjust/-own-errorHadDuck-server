const models = require('../models');

module.exports = {
  truncate: async function(req, res) {
    try {
      Promise.all([
        models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0'),
        models.sequelize.sync({ force: true }),
        models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
      ])
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
