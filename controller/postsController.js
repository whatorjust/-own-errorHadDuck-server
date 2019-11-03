const models = require('../models');

module.exports = {
  newPost: async function(req, res) {
    try {
      models.User.findOne({
        where: {
          id: req.body.userid
        }
      }).then(user => {
        models.Post.create({
          UserId: user.id,
          postname: req.body.post.postname,
          postcode: req.body.post.postcode,
          solution: req.body.post.solution
        })
          .then(result => {
            return result.dataValues;
          })
          .then(post => {
            if (req.body.refer) {
              //refers array가 있는 경우
              Promise.all(
                req.body.refer.map(refer => {
                  models.Refer.create({
                    PostId: post.id,
                    referurl: refer.referurl,
                    understand: refer.understand
                  });
                })
              ).then(() => {
                if (req.body.keyword) {
                  models.Post.findOne({ where: { id: post.id } }).then(post => {
                    Promise.all(
                      req.body.keyword.map(keyword => {
                        models.Keyword.create({
                          keyword: keyword
                        }).then(keyword => {
                          models.Poskey.create({
                            KeywordId: keyword.id,
                            PostId: post.id
                          });
                        });
                      })
                    ).then(() => {
                      res.status(200).send({ postid: post.id });
                    });
                  });
                } else {
                  res.status(200).send({ postid: post.id });
                }
              });
            } else {
              res.status(200).send({ postid: post.id });
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
      // res.send(req.params.id);
      models.Post.findAll({
        where: {
          id: req.params.id
        },
        include: [
          {
            model: models.Poskey,
            include: { model: models.Keyword }
          },
          { model: models.Refer }
        ]
      }).then(result => {
        console.log('----', result.length);
        console.log('----', result.Poskeys);
        res.send(result);
      });
    } catch (err) {
      console.log('err', err);
      res.sendStatus(500);
    }
  }
};
