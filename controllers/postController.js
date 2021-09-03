const Post = require('../models/Post');

exports.viewCreate = function (req,res) {
    res.render('create-post');
}


exports.create = function (req,res) {
    let post = new Post(req.body);
    post.store()
        .then(() => {
            res.send('post store completed')
        })
        .catch((err) => {
            console.log(`Error ${ err }`);
        });
}