const User = require('../models/User');

exports.login = async function (req,res) {
    let user = new User(req.body);
    const result = await user.login();
    if (result.username) {
        req.session.username = user.data.username;
        req.session.isLogin = true;
        req.session.save(function () {
            res.redirect('/');
        });
    } else {
        req.flash('errors' , result);
        req.session.save(function () {
            res.redirect('/');
        });
    }
}

exports.logout = function (req,res) {
    req.session.destroy(function () {
        res.redirect('/');
    }); 
}

exports.register = function ( req,res ) {
    let user = new User(req.body);
    user.register();
    if (user.errors.length > 0 ) {
        // res.send(user.errors);
        // console.log(user.errors);
        user.errors.forEach( function (msg) {
            req.flash('regErrors' , msg);
        });

        req.session.save(function () {
            res.redirect('/');
        });

    } else {
        res.send('your registration complete');
    }
}

exports.home = function (req,res) {
    if (req.session.username) {
        res.render('home-dashboard' , { isLogin: req.session.isLogin , username: req.session.username } );
    } else {
        res.render('home' , { isLogin: false , errors: req.flash('errors') , regErrors: req.flash('regErrors') } );
    }
}