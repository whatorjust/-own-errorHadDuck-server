const models = require('../models');
require('dotenv').config();
const secret = process.env.secret;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mysalt = process.env.salt;

module.exports = {
  login: function(req, res) {
    try {
      let token = jwt.sign(
        {
          username: req.body.username
        },
        secret,
        {
          expiresIn: '1h' //유효시간 1hour
        }
      );

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
              password: crypto
                .createHash('sha512')
                .update(req.body.password + mysalt)
                .digest('base64')
            }
          }).then(result => {
            if (result) {
              //이름,비밀번호 전부 맞은 경우
              res.cookie('oreo', token); //쿠키에 oreo라는 이름으로 token저장
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
    rawInfo.password = crypto
      .createHash('sha512')
      .update(rawInfo.password + mysalt)
      .digest('base64');
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
