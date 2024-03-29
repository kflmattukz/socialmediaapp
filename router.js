const router = require('express').Router();
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');
const followController = require('./controllers/followController');

//USERS route
router.get('/' , userController.home);
router.post('/login' , userController.login);
router.post('/logout' , userController.logout);
router.post('/register', userController.register);
router.post('/isUserExist_' , userController.isUserExist_);
router.post('/isEmailExist' , userController.isEmailExist);

//Profile router
router.get('/profile/:username' , userController.isUserExist , userController.sharedProfileData, userController.viewProfile);

//POST Route
router.get('/create-post' , userController.isUserLogin ,postController.viewCreate);
router.post('/create-post' , userController.isUserLogin ,postController.create);
router.get('/post/:id' , postController.viewSingle);
router.get('/post/:id/edit' ,userController.isUserLogin ,  postController.viewEdit);
router.post('/post/:id/edit' , userController.isUserLogin ,  postController.update);
router.post('/post/:id/delete' ,userController.isUserLogin ,  postController.delete);

router.post('/search', postController.search);

//Follow router
router.post('/follow/:username' , userController.isUserLogin , followController.addFollow);
router.post('/unfollow/:username' , userController.isUserLogin , followController.unFollow);

module.exports = router;