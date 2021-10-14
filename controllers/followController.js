const Follow = require('../models/Follow');

exports.addFollow = function (req,res) { 
    let follow = new Follow(req.params.username , req.visitorId)
    follow.create().then( (result) => { 
        req.flash('success' , `Success to follow ${ req.params.username }`)
        req.session.save(() => {
            res.redirect(`/profile/${ req.params.username }`);
        })
     } ).catch( errors => {
        errors.forEach( error => {
            req.flash('errors' , error)
        })

        req.session.save( () => {
            res.redirect('/')
        })
     } )
}

exports.unFollow = function (req,res) { 
    let follow = new Follow(req.params.username , req.visitorId)
    follow.remove().then( (result) => { 
        req.flash('success' , `Success to Unfollow ${ req.params.username }`)
        req.session.save(() => {
            res.redirect(`/profile/${ req.params.username }`);
        })
     } ).catch( errors => {
        errors.forEach( error => {
            req.flash('errors' , error)
        })

        req.session.save( () => {
            res.redirect('/')
        })
     } )
}

exports.checkFollow = function (req, res, next) {
    let follow = new Follow(req.user.username)
    follow.checkFollow().then(() => {
        next()
    }).catch((errs) => {
        errs.forEach(err => {
            req.flash('errors', err)
        })
        req.session.save(() => {
            res.session('/')
        })
    })
}