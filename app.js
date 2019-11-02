const express = require('express');
const router = require('./routes.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const models = require('./models');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/', router);
const port = process.env.SERVER_PORT || 3000;
app.get('/', (req, res) => res.send('Quack Quack!!'));
models.sequelize
  .sync()
  .then(() => {
    console.log('model defined');
    app.listen(port, () =>
      console.log(`Example app listening on port ${port}!`)
    );
  })
  .catch(err => {
    console.error(err);
  });
