const User = require('../models/User');
exports.login = function (req,res) {
    if (req.body.username === 'kflmattukz' && req.body.password === '12345678') {
        res.send('you loggin successfully');
    }
}

exports.register = function ( req,res ) {
    const user = new User();
    user.register(req.body);
    res.send('your register is completed');
}

exports.home = function ( req,res ) {
    res.render('home');
}