const express = require('express');
const router = express.Router();
const userController = require('./controller/userController');

router.get('/' , (req,res) =>{
    res.render('home');
});

router.post('/register', (req,res) => {
    console.log(req.body);
    res.send('you register successfully');
});

module.exports = router;