const models = require('../models');
const secret = process.env.secret;
const jwt = require('jsonwebtoken');

module.exports = {
  truncate: async function(req, res) {
    try {
      let token = req.cookies.oreo; //cookie-parser이용
      let decoded = jwt.verify(token, secret);
      if (decoded.username === 'admin') {
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
      } else {
        res.status(400).send({ msg: 'notAdmin' });
      }
    } catch (err) {
      res.sendStatus(500);
    }
  }
};
