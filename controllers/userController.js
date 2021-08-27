const User = require('../models/User');
// exports.login = function () {

// }

exports.register = function ( req,res ) {
    const user = new User();
    user.register(req.body);
    res.send('your register is completed');
}

exports.home = function ( req,res ) {
    res.render('home');
}