const validator = require('validator');
const userCollection = require('../db').db('Socialapp').collection('users');
const bcrypt = require('bcryptjs');
// const md5 = require('md5');

const User = function (data) {
    this.data = data;
    this.errors = [];
}

User.prototype.cleanUp = function () {
    if (typeof(this.data.username) != 'string') { this.data.username = ''; }
    if (typeof(this.data.email) != 'string') { this.data.email = ''; }
    if (typeof(this.data.password) != 'string') { this.data.password = ''; }

    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    } 
}

User.prototype.validate = function () {
    return new Promise (async (resolve , reject) => {
        if (this.data.username === '') { this.errors.push('Username can\'t be empty') }
        if (this.data.username != '' && !validator.isAlphanumeric(this.data.username)) { this.errors.push('Username can be only letter and number'); }
        if (!validator.isEmail(this.data.email)) { this.errors.push('Email can\'t be empty and must be a valid email') }
        if (this.data.password === '') { this.errors.push('Password can\'t be empty') }
        if (this.data.password.length > 0 && this.data.password.length < 8) { this.errors.push('Password must at least 8 characters') }
        if (this.data.password.length > 100 ) { this.errors.push('Password maximun 100 characters') }
        if (this.data.username.length > 0 && this.data.username.length < 3) { this.errors.push('Username must at least 3 characters') }
        if (this.data.password.length > 30 ) { this.errors.push('Username maximun 30 characters') }
    
        if (this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)) {
            let isUsernameExist = await userCollection.findOne({username: this.data.username});
            if (isUsernameExist) { this.errors.push('username already taken') }
        }
    
        if (validator.isEmail(this.data.email)) {
            let isEmailExist = await userCollection.findOne({email: this.data.email});
            if (isEmailExist) { this.errors.push('email already taken') }
        }

    resolve();
    });
}

User.prototype.login = async function () {
    this.cleanUp();
    const attmpUser = await userCollection.findOne({username: this.data.username});
    if (attmpUser && bcrypt.compareSync(this.data.password , attmpUser.password)) {
        console.log(attmpUser._id);
        return attmpUser;
    } else {
        return 'invalid username/password';
    }
}

User.prototype.logout = function () {
    
}

User.prototype.register = function () {
    return new Promise(async (resolve , reject) => {
        this.cleanUp();
        await this.validate();
    
        if ( !this.errors.length ) {
            //HASH user password
            let salt = bcrypt.genSaltSync(10);
            this.data.password = bcrypt.hashSync(this.data.password , salt);
            await userCollection.insertOne(this.data);
            resolve(this.data);
        } else {
            reject(this.errors);
        }
    })
}

// User.prototype.getAvatar = function (email) {
//     let hash = md5(email);
//     return `https://www.gravatar.com/avatar/${ hash }`;
// }

module.exports = User;