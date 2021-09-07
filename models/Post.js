const postCollection = require('../db').db('Socialapp').collection('posts');
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

// Post.getPosts = function() {
//     return new Promise( async(resolve ,reject) => {
//         const posts = await postCollection.find({}).toArray();
//         if (posts) {
//             // console.log(posts);
//             resolve(posts);
//         } else {
//             this.errors.push('something went wrong , please try again later');
//             reject(this.errors);
//         }
//     });
// }


Post.getPostById = function(id) {
    return new Promise(async function (resolve,reject) {
        // console.log(typeof(id) != "string");
        if (typeof(id) != "string" || !ObjectID.isValid(id)) {
            // console.log('some error');
            reject();
            return
        }

        let post = await postCollection.findOne({ _id: new ObjectID(id)});
        if (post) {
            resolve(post);
        } else {
            reject();
        }
    });
}

module.exports = Post;