const models = require('../models');

module.exports = {
  truncate: async function(req, res) {
    console.log('try truncate');
    try {
      Promise.all([
        models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0'),
        models.sequelize.sync({ force: true }),
        models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
      ])
        .then(result => {
          console.log('------------------reset asso', result);
          if (result) {
            console.log('truncate완료', result);
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
