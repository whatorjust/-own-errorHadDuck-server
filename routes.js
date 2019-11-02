const controller = require('./controller');
const router = require('express').Router();

router.post('/users/login', controller.users.login);
router.post('/users/signup', controller.users.signup);
//컨트롤러도 분기 하자 /users, /posts
module.exports = router;
