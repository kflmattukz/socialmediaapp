const postCollection = require('../db').db('Socialapp').collection('posts');
// const User = require('./User');
const ObjectID = require('mongodb').ObjectId;

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
        title: this.data.title.trim(),
        content: this.data.content.trim(),
        created_at : new Date(),
        author : ObjectID(this.userId)
    }
}

Post.prototype.validate = function () {
    if ( this.data.title === '' ) { this.errors.push('Title post can\'t be empty')}
    if ( this.data.content === '' ) { this.errors.push('Content post can\'t be empty')}
}

Post.prototype.store = function () {
    return new Promise( (resolve , reject) => {
        this.cleanUp();
        this.validate();

        if ( !this.errors.length ) {
            postCollection.insertOne(this.data)
                .then(() => {
                    resolve();
                }).catch(() => {
                    reject('Please try again later');
            })
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
            {$lookup: { from: "users" , localField: "author" , foreignField: "_id" , as: "authorDoc"}},
            {$project: {
                title: 1,
                content: 1,
                created_at:1,
                authorId : "$author",
                author: { $arrayElemAt: ["$authorDoc" , 0] }
            }}
        ]);

        let posts = await postCollection.aggregate(aggregateOpti).toArray();

        if (posts) {
            posts = posts.map(function (post) {
                post.isVisitorOwner = post.authorId.equals(visitorId)
                post.author = {
                    username: post.author.username,
                    email: post.author.email
                }
                return post;
            });
        } else {
            reject('Something went wrong, please try again later');
        }
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
    return new Promise( async(resolve ,reject) => {
        if ( typeof(authorId) != 'string' && !ObjectID.isValid(authorId)) {
            reject()
            return
        }

        let posts = await Post.getPost([{ $match: { "author": new ObjectID(authorId) } }])
        if (posts) {
            resolve(posts)
        } else {
            console.log('here...')
            reject()
        }
    });
}




module.exports = Post;