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
// app.use(cors());
app.all('/*', function(req, res, next) {
  res.header(
    'Access-Control-Allow-Origin',
    'http://mysterious-journey.surge.sh'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET,PUT,POST,DELETE,OPTIONS,PATCH'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With'
  );
  res.header('Access-Control-Allow-credentials', true);
  console.log(res.getHeaders());
  next();
});
app.use(bodyParser.json());
app.use(cookieParser());
const port = process.env.SERVER_PORT || 3000;

app.get('/', (req, res) => res.send('Quack Quack!!'));
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
