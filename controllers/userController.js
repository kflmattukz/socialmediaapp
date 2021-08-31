const User = require('../models/User');

exports.login = async function (req,res) {
   let user = new User(req.body);

    const result = await user.login();
    if (result) {
        res.send(result);
    } else {
        res.send(result);
    }
}

exports.register = function ( req,res ) {
    let user = new User(req.body);
    user.register();
    if (user.errors.length > 0 ) {
        res.send(user.errors);
    } else {
        res.send('your registration complete');
    }
}