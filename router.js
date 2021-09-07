const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');

//USERS route
router.get('/' , userController.home);
router.post('/login' , userController.login);
router.get('/logout' , userController.logout);
router.post('/register', userController.register);

//POST Route
router.get('/create-post' , userController.isUserLogin ,postController.viewCreate);
router.post('/create-post' , userController.isUserLogin ,postController.create);
router.get('/post/:id' , postController.viewSingle);


module.exports = router;