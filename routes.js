const controller = require('./controller');
const router = require('express').Router();

router.post('/users/login', controller.users.login);
router.post('/users/signup', controller.users.signup);

module.exports = router;
