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
          //이거 result length0인 배열이라도 통과된다. result확인 필요
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
