const usersController = require('./controller/usersController');
const postsController = require('./controller/postsController');
const adminController = require('./controller/adminController');
const router = require('express').Router();

router.post('/users/login', usersController.login);
router.post('/users/signup', usersController.signup);

router.post('/posts', postsController.newPost);
router.get('/posts/:id', postsController.getOne);
router.delete('/posts/:id', postsController.deleteOne);
router.get('/posts', postsController.getAll); //iscomplete쿼리 역시 해당 메소드에서 처리.

router.get('/admin/truncate', adminController.truncate);
module.exports = router;
