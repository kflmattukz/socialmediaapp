const User = require('../models/User');
const Post = require('../models/Post');

exports.login = async function (req,res) {
    let user = new User(req.body);
    const result = await user.login();
    if (result.username) {
        req.session.user = {
            username: result.username,
            email: result.email,
            _id: result._id
        }
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
    
    user.register()
        .then(() => {
            req.session.user = {
                username: user.data.username,
                _id: user.data._id
            }

            req.session.save(function () {
                res.redirect('/');
            })
        })
        .catch((regErrors) => {
            regErrors.forEach( function (msg) {
                req.flash('regErrors' , msg);
            });
    
            req.session.save(function () {
                res.redirect('/');
            });
        });
    
}

exports.isUserLogin = function (req,res,next) {
    if (req.session.user) {
        next()
    } else {
        req.flash('errors' , 'you must login to first');
        req.session.save(() => {
            res.redirect('/');
        });
    }
}

exports.isUserExist = function (req,res ,next) {
    User.findByUsername(req.params.username).then((userDoc) => {
        req.profileUser = userDoc
        next()
    }).catch(() => {
        res.render('404')
    })
    
}

exports.viewProfile = function (req,res) {
    Post.getPostByAuthorId(req.profileUser._id).then((posts) => {
        res.render('profile' , {profile: req.profileUser , posts: posts});
    }).catch(() => {
        res.render('404')
    })
}

exports.home = function (req,res) {
    if (req.session.user) {
        res.render('home-dashboard');
    } else {
        res.render('home' , {regErrors: req.flash('regErrors')});
    }
}