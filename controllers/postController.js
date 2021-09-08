const Post = require('../models/Post');

exports.viewCreate = function (req,res) {
    res.render('create-post');
}

exports.viewSingle = async function (req,res) {
    try {
        let post = await Post.getPostById(req.params.id);
        res.render('single-post' , {post: post});
    } catch (err) {
        res.render('404');
    }
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