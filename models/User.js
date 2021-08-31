const validator = require('validator');
const userCollection = require('../db').collection('users');
const bcrypt = require('bcryptjs');

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
    if (this.data.username === '') { this.errors.push('Username can\'t be empty') }
    if (this.data.username != '' && !validator.isAlphanumeric(this.data.username)) { this.errors.push('Username can be only letter and number'); }
    if (!validator.isEmail(this.data.email)) { this.errors.push('Email can\'t be empty and must be a valid email') }
    if (this.data.password === '') { this.errors.push('Password can\'t be empty') }
    if (this.data.password.length > 0 && this.data.password.length < 8) { this.errors.push('Password must at least 8 characters') }
    if (this.data.password.length > 100 ) { this.errors.push('Password maximun 100 characters') }
    if (this.data.username.length > 0 && this.data.username.length < 3) { this.errors.push('Username must at least 3 characters') }
    if (this.data.password.length > 30 ) { this.errors.push('Username maximun 30 characters') }
}

User.prototype.login = async function () {
    this.cleanUp();
    const attmpUser = await userCollection.findOne({username: this.data.username});
    if (attmpUser && attmpUser.password == this.data.password) {
        return 'login success';
    } else {
        return 'username/password is wrong';
    }
}

User.prototype.register = function () {
    this.cleanUp();
    this.validate();

    if ( !this.errors.length ) {
        //HASH user password
        let salt = bcrypt.genSaltSync(10);
        this.data.password = bcrypt.hashSync(this.data.password , salt);
        userCollection.insertOne(this.data);
    }
}

module.exports = User;