const models = require('../models');

module.exports = {
  login: function(req, res) {
    try {
      models.User.findOne({
        //name존재부터 check
        where: {
          username: req.body.username
        }
      }).then(result => {
        if (result) {
          models.User.findOne({
            //name존재부터 check
            where: {
              username: req.body.username,
              password: req.body.password
            }
          }).then(result => {
            if (result) {
              res.status(200).send({ userid: result.id });
            } else {
              //비밀번호가 틀린 경우
              res.status(400).send({ msg: 'password' });
            }
          });
        } else {
          //아이디부터 없는 경우
          res.status(400).send({ msg: 'username' });
        }
      });
    } catch (err) {
      res.sendStatus(500);
    }
  },
  signup: function(req, res) {
    let rawInfo = req.body;
    // rawInfo.password = utils.crypto(rawInfo.password);
    try {
      models.User.findOne({
        where: {
          email: req.body.email
        }
      }).then(result => {
        if (result) {
          res.status(400).send({ msg: 'email' });
        } else {
          models.User.findOne({
            where: {
              username: req.body.username
            }
          }).then(result => {
            if (result) {
              res.status(400).send({ msg: 'username' });
            } else {
              models.User.create(rawInfo).then(() => {
                models.User.findOne({
                  where: {
                    email: req.body.email,
                    password: rawInfo.password
                  }
                }).then(result => {
                  if (result) {
                    res.sendStatus(200);
                  }
                });
              });
            }
          });
        }
      });
    } catch (err) {
      console.log('err', err);
      res.sendStatus(500);
    }
  }
};
