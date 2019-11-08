const models = require('../models');
require('dotenv').config();
const secret = process.env.secret;
const jwt = require('jsonwebtoken');

module.exports = {
  newPost: async function(req, res) {
    try {
      //이거 jwt이용해서 토큰에 있는 userid 가져오자
      let token = req.cookies.oreo; //cookie-parser이용
      let decoded = jwt.verify(token, secret);

      //해당 유저에 연결시켜주기 위해 해당 유저객체 find
      models.User.findOne({ where: { username: decoded.username } }).then(
        user => {
          models.Post.create({
            UserId: user.id,
            postname: req.body.post.postname,
            postcode: req.body.post.postcode,
            solution: req.body.post.solution,
            iscomplete: req.body.post.iscomplete
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
                if (req.body.keyword.length !== 0) {
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
              if (req.body.keyword.length !== 0) {
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
        }
      );
    } catch (err) {
      res.sendStatus(500);
    }
  },
  getOne: function(req, res) {
    //본인 소유 글만 볼 수 있게 수정해야함
    try {
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
          let token = req.cookies.oreo; //cookie-parser이용
          let decoded = jwt.verify(token, secret);

          models.User.findOne({
            where: {
              username: decoded.username
            }
          }).then(user => {
            if (user.id === result.UserId) {
              res.send(result);
            } else {
              res.status(400).send({ msg: 'noAuth' });
            }
          });
        } else {
          //예외 확인 완료
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

        models.User.findOne({ where: { username: decoded.username } })
          .then(user => {
            if (req.query.iscomplete) {
              //요거는 오게 맞다. body아니야!
              //iscomplete query들어올 경우
              return models.Post.findAll({
                //입력받은 postid를 통해 post선택
                where: {
                  UserId: user.id,
                  iscomplete: req.query.iscomplete === 'true' ? 1 : 0
                }
              });
            } else {
              return models.Post.findAll({
                //입력받은 postid를 통해 post선택
                where: {
                  UserId: user.id
                }
              });
            }
          })
          .then(result => {
            if (result.length !== 0) {
              res.send(result);
            } else {
              res.status(400).send({ msg: 'noPost' });
            }
          });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
  deleteOne: async function(req, res) {
    try {
      // 먼저 해당아이디와 postid로 삭제할 where절 구성
      let token = req.cookies.oreo; //cookie-parser이용
      let decoded = jwt.verify(token, secret);
      models.User.findOne({
        where: {
          username: decoded.username
        }
      }).then(user => {
        //associate에서 cascade옵션 줬으나, n:m 과정인 poskey와 keyword는 삭제 안되고 있음.
        //그러면 포스키만 날리자. keyword는 poskey날리고 참조0일때만 날리고
        Promise.all([
          models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0'),
          models.Poskey.destroy({ where: { PostId: req.params.id } }),
          models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
        ]).then(() => {
          models.Post.destroy({
            //입력받은 postid와 token의 username을 통해 확인한 userid로 post선택
            where: {
              id: req.params.id,
              UserId: user.id
            }
          }).then(result => {
            if (result) {
              res.sendStatus(200);
            } else {
              res.status(400).send({ msg: 'failDelete' });
            }
          });
        });
      });
    } catch (err) {
      console.log('err', err);
      res.sendStatus(500);
    }
  },
  patchOne: async function(req, res) {
    try {
      // 먼저 해당아이디와 postid로 업데이트 할 where절 구성
      let token = req.cookies.oreo; //cookie-parser이용
      let decoded = jwt.verify(token, secret);
      models.User.findOne({
        where: {
          username: decoded.username
        }
      })
        .then(user => {
          return models.Post.update(req.body.post, {
            where: { id: req.params.id, UserId: user.id }
          });
        })
        .then(() => {
          return models.Post.findOne({ where: { id: req.params.id } });
        })
        .then(postUpdate => {
          if (postUpdate) {
            if (req.body.refer.length) {
              console.log('refer있다');
              Promise.all([
                models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0'),
                models.Refer.destroy({ where: { PostId: req.params.id } }), //레퍼 뽀각
                models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
              ])
                .then(() => {
                  Promise.all(
                    //래퍼 뽀각 다시 생성
                    req.body.refer.map(refer => {
                      models.Refer.create({
                        PostId: postUpdate.id,
                        referurl: refer.referurl,
                        understand: refer.understand
                      });
                    })
                  );
                })
                .then(result => {
                  console.log('keyword있다', result);
                  Promise.all([
                    models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0'),
                    models.Poskey.destroy({
                      where: { PostId: req.params.id }
                    }), //포스키 뽀개고 키워드 살려둔다.
                    models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
                  ]).then(() => {
                    if (req.body.keyword.length) {
                      Promise.all(
                        req.body.keyword.map(keyword => {
                          models.Keyword.findOne({
                            where: { keyword: keyword }
                          }) //이미 존재하는 keyword인지 확인
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
                                PostId: postUpdate.id
                              });
                            });
                        })
                      ).then(() => {
                        res.status(200).send({
                          postid: postUpdate.id,
                          changed: ['post', 'refer', 'keyword']
                        });
                      });
                    } else {
                      //요기 레퍼있고 키워드 없는 경우
                      res.status(200).send({
                        postid: postUpdate.id,
                        changed: ['post', 'refer']
                      });
                    }
                  });
                });
            } else {
              console.log('refer없다');
              //refer없는데, keyword변경사항 있는 경우.
              if (req.body.keyword.length) {
                console.log('keyword있다');
                Promise.all([
                  models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0'),
                  models.Poskey.destroy({ where: { PostId: req.params.id } }), //포스키 뽀개고 키워드 살려둔다.
                  models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
                ])
                  .then(() => {
                    Promise.all(
                      req.body.keyword.map(keyword => {
                        models.Keyword.findOne({
                          where: { keyword: keyword }
                        }) //이미 존재하는 keyword인지 확인
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
                              PostId: postUpdate.id
                            });
                          });
                      })
                    );
                  })
                  .then(() => {
                    res.status(200).send({
                      postid: postUpdate.id,
                      changed: ['post', 'keyword']
                    });
                  });
              } else {
                res
                  .status(200)
                  .send({ postid: postUpdate.id, changed: ['post'] });
              }
            }
          } else {
            res.status(400).send({ msg: 'noPost' });
          }
        });
    } catch (err) {
      res.status(500).send(err);
    }
  }
};
