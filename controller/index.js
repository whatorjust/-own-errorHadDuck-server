const models = require('../models');

module.exports = {
  users: {
    login: function(req, res) {
      try {
        models.Users.findOne({
          //name존재부터 check
          where: {
            username: req.body.username
          }
        }).then(result => {
          if (result) {
            models.Users.findOne({
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
        models.Users.findOne({
          where: {
            email: req.body.email
          }
        }).then(result => {
          if (result) {
            res.status(400).send({ msg: 'email' });
          } else {
            models.Users.findOne({
              where: {
                username: req.body.username
              }
            }).then(result => {
              if (result) {
                res.status(400).send({ msg: 'username' });
              } else {
                models.Users.create(rawInfo).then(() => {
                  models.Users.findOne({
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
  }
};
