const express = require('express');
const router = require('./routes.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const models = require('./models');
require('dotenv').config();
const secret = process.env.secret;
const jwt = require('jsonwebtoken');
const app = express();
const cookieParser = require('cookie-parser');
app.use(
  cors({
    credentials: true,
    origin: [
      'http://mysterious-journey.surge.sh',
      'http:127.0.0.1:3000',
      'http://errorhadduck.s3-website.ap-northeast-2.amazonaws.com '
    ]
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
const port = process.env.SERVER_PORT || 3000;

app.get('/', (_, res) => res.send('Quack Quack!!'));
const JWTmiddleWare = (req, res, next) => {
  try {
    if (req.path !== '/users/signup' && req.path !== '/users/login') {
      let token = req.cookies.oreo; //cookie-parser이용
      let decoded = jwt.verify(token, secret);

      if (decoded) {
        //토큰 통과시
        next();
      }
      //회원가입 이외에는 전부 토큰 인증부터 합니다
    } else {
      next();
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

app.use(JWTmiddleWare);
app.use('/', router);

models.sequelize
  .sync()
  .then(() => {
    app.listen(port, () =>
      console.log(`Example app listening on port ${port}!`)
    );
  })
  .catch(err => {
    console.error(err);
  });
