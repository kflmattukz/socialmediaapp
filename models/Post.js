const postCollection = require('../db').db('Socialapp').collection('posts');
const User = require('./User');
const ObjectID = require('mongodb').ObjectId;

const Post = function (data , userId) {
    this.data = data;
    this.errors = [];
    this.userId = userId;
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


Post.getPost = function(aggregateOpti) {
    return new Promise(async function (resolve,reject) {
        aggregateOpti = aggregateOpti.concat([
            {$lookup: { from: "users" , localField: "author" , foreignField: "_id" , as: "authorDoc"}},
            {$project: {
                title: 1,
                content: 1,
                created_at:1,
                author: { $arrayElemAt: ["$authorDoc" , 0] }
            }}
        ]);

        let posts = await postCollection.aggregate(aggregateOpti).toArray();

        if (posts.length) {
            posts = posts.map(function (post) {
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


Post.getPostById = function(id) {
    return new Promise ( async function (resolve , reject) {
        if (typeof(id) != 'string' && !ObjectID.isValid(id)) {
            reject()
            return
        }
    
        let post = await Post.getPost([{ $match: { "_id": new ObjectID(id) } }]);
    
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
        if (posts.length) {
            resolve(posts)
        } else {
            reject()
        }
    });
}

module.exports = Post;