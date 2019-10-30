const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.SERVER_PORT || 3000;
app.get('/', (req, res) => res.send('Quack Quack!!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
