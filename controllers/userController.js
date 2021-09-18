const User = require('../models/User');
const Post = require('../models/Post');
const Follow = require('../models/Follow');

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
        res.render('profile' , {
            profile: req.profileUser, 
            posts: posts,
            visitorId: req.visitorId,
            isFollowing: req.isFollowing,
            isVisitorProfile: req.isVisitorProfile,
            followings: req.getFollowing,
            followers: req.getFollower
        });
    }).catch(() => {
        res.render('404')
    })
}

exports.sharedProfileData = async function (req,res,next) {
    let isVisitorProfile = false;
    let isFollowing = false;
    if (req.session.user) {
        isVisitorProfile = req.profileUser._id.equals(req.session.user._id)
        getFollower = await Follow.getFollowerById(req.profileUser._id)
        getFollowing = await Follow.getFollowingById(req.profileUser._id)
        isFollowing = await Follow.isFollowing(req.profileUser._id , req.visitorId)
    } 

    req.getFollower = getFollower
    req.getFollowing = getFollowing
    req.isVisitorProfile = isVisitorProfile
    req.isFollowing = isFollowing
    next()
}

exports.home = async function (req,res) {
    if (req.session.user) {
        let posts = await Post.getFeed(req.visitorId)

        posts = posts.map(post => {
            _id = post._id
            title = post.title
            content = post.content
            created_at = new Date(post.created_at)
            author = post.author
            
            return { _id,title,content,created_at,author }
        })

        res.render('home-dashboard', { posts: posts });
    } else {
        res.render('home' , {regErrors: req.flash('regErrors')});
    }
}