const models = require('../models');
require('dotenv').config();
const secret = process.env.secret;
const jwt = require('jsonwebtoken');

module.exports = {
  newPost: async function(req, res) {
    try {
      //해당 유저에 연결시켜주기 위해 해당 유저객체 find
      models.User.findOne({
        where: {
          id: req.body.userid
        }
      }).then(user => {
        //id없는데 post하는 경우 에러처리 안되고있음
        //해당 유저의 post생성
        if (!user) {
          res.status(400).send({ msg: 'noUser' });
        }
        models.Post.create({
          UserId: user.id, //지금 user없는 경우 처리 안되고있음
          postname: req.body.post.postname,
          postcode: req.body.post.postcode,
          solution: req.body.post.solution
        }).then(post => {
          if (req.body.refer) {
            //refers array가 있는 경우 반복문 비동기 처리를 통해, 다수의 refer객체 생성
            Promise.all(
              req.body.refer.map(refer => {
                models.Refer.create({
                  PostId: post.id,
                  referurl: refer.referurl,
                  understand: refer.understand
                });
              })
            ).then(() => {
              //keyword 항목 존재 경우 반복문 비동기 처리를 통해, 다수의 Keyword객체 생성
              if (req.body.keyword) {
                Promise.all(
                  req.body.keyword.map(keyword => {
                    models.Keyword.findOne({ where: { keyword: keyword } }) //이미 존재하는 keyword인지 확인
                      .then(found => {
                        if (found) {
                          return found;
                        } else {
                          //새로운 keyword일 시에만 keyword생성
                          return models.Keyword.create({
                            keyword: keyword
                          });
                        }
                      }) //해당 keyword의 id를 조인테이블을 통해 post와 연결해줌
                      .then(keyword => {
                        models.Poskey.create({
                          KeywordId: keyword.id,
                          PostId: post.id
                        });
                      });
                  })
                ).then(() => {
                  res.status(200).send({ postid: post.id });
                });
              } else {
                //keyword없는 경우
                res.status(200).send({ postid: post.id });
              }
            });
          } else {
            //refer없는 경우
            if (req.body.keyword) {
              Promise.all(
                req.body.keyword.map(keyword => {
                  models.Keyword.findOne({ where: { keyword: keyword } }) //이미 존재하는 keyword인지 확인
                    .then(found => {
                      if (found) {
                        return found;
                      } else {
                        //새로운 keyword일 시에만 keyword생성
                        return models.Keyword.create({
                          keyword: keyword
                        });
                      }
                    }) //해당 keyword의 id를 조인테이블을 통해 post와 연결해줌
                    .then(keyword => {
                      models.Poskey.create({
                        KeywordId: keyword.id,
                        PostId: post.id
                      });
                    });
                })
              ).then(() => {
                res.status(200).send({ postid: post.id });
              });
            } else {
              res.status(200).send({ postid: post.id });
            }
          }
        });
      });
    } catch (err) {
      res.sendStatus(500);
    }
  },
  getOne: function(req, res) {
    try {
      console.log('id', req.params.id);
      models.Post.findOne({
        //입력받은 postid를 통해 post선택
        where: {
          id: req.params.id
        }, //참조관계인 model:Poskey도 포함
        include: [
          {
            model: models.Poskey, //연관된 models.Poskey에 연관된 models.Keyword도 포함
            include: { model: models.Keyword }
          },
          { model: models.Refer } //참조관계인 model:Refer 포함
        ]
      }).then(result => {
        if (result) {
          res.send(result);
        } else {
          res.status(400).send({ msg: 'noPost' });
        }
      });
    } catch (err) {
      console.log('err', err);
      res.sendStatus(500);
    }
  },
  getAll: function(req, res) {
    try {
      //이거 jwt이용해서 토큰에 있는 userid 가져오자
      let token = req.cookies.oreo; //cookie-parser이용
      let decoded = jwt.verify(token, secret);
      if (decoded) {
        //토큰 통과시
        models.User.findOne({ where: { username: decoded.username } }).then(
          user => {
            models.Post.findAll({
              //입력받은 postid를 통해 post선택
              where: {
                UserId: user.id
              }, //참조관계인 model:Poskey도 포함
              include: [
                {
                  model: models.Poskey, //연관된 models.Poskey에 연관된 models.Keyword도 포함
                  include: { model: models.Keyword }
                },
                { model: models.Refer } //참조관계인 model:Refer 포함
              ]
            }).then(result => {
              if (result) {
                res.send(result);
              } else {
                res.status(400).send({ msg: 'noPost' });
              }
            });
          }
        );
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
};
