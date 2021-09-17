const usersCollection = require("../db").db('Socialapp').collection('users')
const followsCollection = require("../db").db('Socialapp').collection('follows')
const ObjectId = require('mongodb').ObjectId
const User = require('./User');

const Follow = function (followedUsername , authorId) {
    this.followedUsername = followedUsername;
    this.authorId = authorId;
    this.errors = [];
}

Follow.prototype.cleanUp = function () {
    if ( typeof(this.followedUsername) != "string") { this.followedUsername = "" }
}

Follow.prototype.validate = async function (action) {
    
    const followedAccount = await usersCollection.findOne({ username: this.followedUsername })
    if (followedAccount) {
        this.followedId = followedAccount._id;
    } else {
        this.errors.push("Users don't exist");
    }

    let isFollowExist = await followsCollection.findOne({followedId: this.followedId , authorId: new ObjectId(this.authorId)})

    if (action == "create") {
        if (isFollowExist) { this.errors.push("You already follow this user") }   
    }

    if (action == "delete") {
        if (!isFollowExist) { this.errors.push("You can unfollow user that you don't follow") }   
    }

    if (this.followedId.equals(this.authorId)) { this.errors.push("You can't follow yourself") }

}

Follow.prototype.create = function () {
    return new Promise ( async (resolve ,reject ) => {
        this.cleanUp()
        await this.validate("create");
        
        if (!this.errors.length) {
            let follow = await followsCollection.insertOne({ followedId: this.followedId , authorId: new ObjectId(this.authorId)})
            resolve(follow)
        } else {
            
            reject(this.errors);
        }
    })
}

Follow.prototype.remove = function () {
    return new Promise ( async (resolve ,reject ) => {
        this.cleanUp()
        await this.validate("remove");
        
        if (!this.errors.length) {
            let follow = await followsCollection.deleteOne({ followedId: this.followedId , authorId: new ObjectId(this.authorId)})
            resolve(follow)
        } else {
            reject(this.errors);
        }
    })
}

Follow.isFollowing = async function (followedId , visitorId) {
    let followDoc = await followsCollection.findOne({followedId: followedId , authorId: new ObjectId(visitorId)})
    if (followDoc) {
        return true
    } else {
        return false
    }
}

Follow.getFollowingById = function (profileId) {
    return new Promise (async (resolve,reject) => {
        try {
            let followingDoc = await followsCollection.aggregate([
                { $match: { authorId: profileId } },
                { $lookup: { from: "users" , localField: "followedId"  ,foreignField: "_id" , as: "userDoc"}},
                { $project : {
                    username: { $arrayElemAt: ["$userDoc.username" , 0]},
                    email: { $arrayElemAt: ["$userDoc.email" , 0]}
                } }
            ]).toArray()
            followingDoc = followingDoc.map(following => {
                let user  = new User(following)
                return {
                    username: following.username,
                    email:following.email
                }
            })
            resolve(followingDoc)
        } catch {
            reject()
        }
    })
}

Follow.getFollowerById = function (profileId) {
    return new Promise (async (resolve,reject) => {
        try {
            let followerDoc = await followsCollection.aggregate([
                { $match: { followedId: profileId } },
                { $lookup: { from: "users" , localField: "authorId"  ,foreignField: "_id" , as: "userDoc"}},
                { $project : {
                    username: { $arrayElemAt: ["$userDoc.username" , 0]},
                    email: { $arrayElemAt: ["$userDoc.email" , 0]}
                } }
            ]).toArray()
            followerDoc = followerDoc.map(follower => {
                let user  = new User(follower)
                return {
                    username: follower.username,
                    email: follower.email
                }
            })
            resolve(followerDoc)
        } catch {
            reject()
        }
    })
}

module.exports = Follow;