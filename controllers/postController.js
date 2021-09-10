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
        
        if (post.authorId == req.visitorId) {
            res.render('edit-post' , {post: post})
        } else {
            req.flash('errors' , 'you dont\'t have permission to edit this post')
            req.session.save(() => { res.redirect('/') })
        }
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
    let post = new Post(req.body, req.session.user._id)
    
    post.store().then( newId => {
            req.flash('success' , 'Create Post success.') 
            req.session.save(() => { res.redirect(`/post/${ newId }`) })
        }).catch( errors => {
            errors.forEach(err => {
                req.flash('errors' , err)
            });
            req.session.save(()=> { res.redirect('/create-post') })
        })
}

exports.delete = function (req, res) {
    Post.destroy(req.params.id , req.visitorId).then( () => {
        req.flash('success' , 'Post successfully deleted.')
        req.session.save( ()=> { res.redirect(`/profile/${ req.session.user.username }`) })
    }).catch( () => {
        req.flash('errors' , 'You don\'t have permission to delete the post.' )
        req.session.save( () => { res.redirect('/') })
    })
}