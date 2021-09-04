const postCollection = require('../db').db('Socialapp').collection('posts');
const ObjectId = require('mongodb').ObjectId;

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
        cretated_at : new Date(),
        author : ObjectId(this.userId)
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

module.exports = Post;