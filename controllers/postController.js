const { rawListeners } = require('../app');
const Post = require('../models/Post');

exports.viewCreate = function (req,res) {
    res.render('create-post');
}

exports.viewSingle = async function (req,res) {
    try {
        let post = await Post.getPostById(req.params.id , req.visitorId);
        res.render('single-post' , {post: post});
    } catch (err) {
        res.render('404');
    }
}

exports.viewEdit = async function (req,res) {
    try {
        let post = await Post.getPostById(req.params.id)
        res.render('edit-post' , {post: post})
    } catch (error) {
        res.render('404');
    }
}

exports.update = function (req,res) {
    let post = new Post(req.body , req.visitorId , req.params.id);
    post.update().then((status) => {
        if (status === "success") {
            req.flash('success' , 'Post update success.')
            req.session.save(function () {
                res.redirect(`/post/${ req.params.id }/edit`)
            })
        } else {
            post.errors.forEach((err) => {
                req.flash('errors' , err)
            })
            req.session.save(function () {
                res.redirect(`/post/${ req.params.id }/edit`)
            })
        }
    }).catch(() => {
        req.flash('errors' , 'you can\'t update the post.')
        req.session.save(function (){
            res.redirect('/')
        })
    })
}

exports.create = function (req,res) {
    let post = new Post(req.body, req.session.user._id);
    post.store()
        .then(() => {
            req.flash('success' , 'Create Post success');
            req.session.save(function () {
                res.redirect('/');
            });
        })
        .catch((err) => {
            console.log(`Error ${ err }`);
        });
}