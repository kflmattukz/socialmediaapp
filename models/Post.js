const postCollection = require('../db').db('Socialapp').collection('posts');
const followCollection = require('../db').db('Socialapp').collection('follows');
const ObjectID = require('mongodb').ObjectId;
const sanitizeHTML = require('sanitize-html');

const Post = function (data , userId , reqPostId) {
    this.data = data;
    this.errors = [];
    this.userId = userId;
    this.reqPostId = reqPostId;
}

Post.prototype.cleanUp = function () {
    if ( typeof(this.data.title) != 'string') { this.data.title = ''}
    if ( typeof(this.data.content) != 'string') { this.data.content = ''}

    this.data = {
        title: sanitizeHTML(this.data.title.trim(), {allowedTags: [] , allowedAttributes: {}}),
        content: sanitizeHTML(this.data.content.trim(), {allowedTags: [] , allowedAttributes: {}}),
        created_at : new Date(),
        author : ObjectID(this.userId)
    }
}

Post.prototype.validate = function () {
    if ( this.data.title == '' ) { this.errors.push('Title post can\'t be empty.')}
    if ( this.data.content == '' ) { this.errors.push('Content post can\'t be empty.')}
}

Post.prototype.store = function () {
    return new Promise( (resolve , reject) => {
        this.cleanUp();
        this.validate();
        // console.log(this.errors)
        if ( !this.errors.length ) {
            postCollection.insertOne(this.data)
                .then( info => { 
                    resolve(info.insertedId)
                }).catch(() => {  
                    this.errors.push('Something weng wrong, Please try again later.')
                    reject(this.errors);
                })
        } else {
            reject(this.errors);
        }
    });
}


Post.prototype.update = function () {
    return new Promise( async (resolve ,reject) => {
        try {
            let post = await Post.getPostById(this.reqPostId , this.userId)
            //cek if the visitor is author of the post 
            // console.log(post.isVisitorOwner)
            if (post.isVisitorOwner) {
                let status = await this.updatePost()
                resolve(status)
            } else {
                reject()
            }
        } catch (err) {
            // reject()
        }
    })
}

Post.prototype.updatePost = function () {
    return new Promise (async (resolve, reject) => {
        this.cleanUp()
        this.validate()

        if (!this.errors.length) {
            await postCollection.findOneAndUpdate({_id: new ObjectID(this.reqPostId)} , {$set: {
                title: this.data.title,
                content: this.data.content
             }})
            resolve('success')
        } else {
            reject('failure')
        }
        reject()
    })
}

Post.getPost = function(aggregateOpti , visitorId) {
    return new Promise(async function (resolve,reject) {
        aggregateOpti = aggregateOpti.concat([
            { $lookup: { from: "users" , localField: "author" , foreignField: "_id" , as: "authorDoc" } },
            { $project: {
                title: 1,
                content: 1,
                created_at:1,
                authorId : "$author",
                author: { $arrayElemAt: ["$authorDoc" , 0] }
            } }
        ]);

        let posts = await postCollection.aggregate(aggregateOpti).toArray();

        posts = posts.map(function (post) {
            post.isVisitorOwner = post.authorId.equals(visitorId)    
            // post.authorId = undefined;
            post.author = {
                username: post.author.username,
                email: post.author.email
            }
            return post;
        });

        resolve(posts);
    });
}

Post.getPostById = function(id , visitorId) {
    return new Promise ( async function (resolve , reject) {
        if (typeof(id) != 'string' && !ObjectID.isValid(id)) {
            reject()
            return
        }
    
        let post = await Post.getPost([{ $match: { "_id": new ObjectID(id) } }] , visitorId);
    
        if (post.length) {
            resolve(post[0]);
        } else {
            reject('something went wrong , please try again later');
        }
    });
}

Post.getPostByAuthorId = function(authorId) {
    // return new Promise( async(resolve ,reject) => {
    //     if ( typeof(authorId) != 'string' && !ObjectID.isValid(authorId)) {
    //         reject()
    //         return
    //     }

    //     let posts = await Post.getPost([
    //         { $match: { "author": new ObjectID(authorId) } },
    //         { $sort: { created_at: -1 }}
    //     ])
    //     if (posts) {
    //         resolve(posts)
    //     } else {
    //         console.log('here...')
    //         reject()
    //     }
    // });
    if (typeof(authorId) != 'string' && !ObjectID.isValid(authorId) ) {
        reject()
        return
    }
    return Post.getPost([
        { $match: { "author": new ObjectID(authorId) } },
        { $sort: { created_at: -1 }}
    ])
}

Post.destroy = function (postId , visitorId) {
    return new Promise( async (resolve , reject) => {
        try {
            let post = await Post.getPostById(postId , visitorId)
            if (post.isVisitorOwner) {
                await postCollection.deleteOne({_id: new ObjectID(postId)})
                resolve()
            } else {
                reject()
            }
        } catch (error) {
            reject()
        }
    })
}

Post.search = function (searchTerm) {
    return new Promise ( async(resolve , reject) => {
        if (typeof(searchTerm) == 'string') {
            let posts = await postCollection.aggregate([
                { $match: { $text: { $search: searchTerm } } },
                { $lookup: { from: "users" , localField: "author" , foreignField: "_id" , as: "authorDoc"} },
                { $sort: { score: { $meta: "textScore" } } },
                { $project: {
                    title: 1,
                    content: 1,
                    created_at: 1,
                    authorId: "$author",
                    author: { $arrayElemAt: [ "$authorDoc" , 0 ] }
                }}
                
            ]).toArray();

            // posts = posts.map(function (post) {
            //     post.author = {
            //     username: post.author.username,
            //     email: post.author.email
            // }
            // return post;
            // });
            
            resolve(posts);
        } else {
            reject()
        }        
    });
}

Post.getFeed = async function (id) {
    let followedUser = await followCollection.find({ authorId: new ObjectID(id) }).toArray()
    followedUser = followedUser.map( followDoc => {
        return followDoc.followedId
    })

    return Post.getPost([
        { $match: { author: { $in: followedUser } } }
        // { $sort: {$created_at: -1 } }
    ])
}

module.exports = Post;