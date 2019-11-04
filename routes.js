const usersController = require('./controller/usersController');
const postsController = require('./controller/postsController');
const router = require('express').Router();

router.post('/users/login', usersController.login);
router.post('/users/signup', usersController.signup);

router.post('/posts', postsController.newPost);
router.get('/posts/:id', postsController.getOne);
module.exports = router;
