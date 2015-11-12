var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    moment = require('moment'),
    crypto = require('crypto'),
    validator = require('validator');

/**
* Schema Definition
**/
var userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    salt: String,
    creationDate: String
});

/**
* Hooks
**/
userSchema.pre('save', function(next){
    // Generate timestamp
    this.creationDate = moment().format('x');

    // Generate Salt
    this.salt = crypto.randomBytes(32).toString('base64');
    // Encrypt Password
    this.password = this.encryptPassword(this.password, this.salt);

    next();
});

/**
* Methods
**/
userSchema.methods.hasValidPassword = function(loginPassword){
    return (this.encryptPassword(loginPassword, this.salt) === this.password);
};
userSchema.methods.isValid = function(){
    return (validator.isAlpha(this.firstName) && validator.isLength(this.firstName, 2, 50) &&
    validator.isAlpha(this.lastName) && validator.isLength(this.lastName, 2, 50) &&
    validator.isEmail(this.email) && validator.isLength(this.email, 5, 30) &&
    validator.isLength(this.password, 6, 30));
};
userSchema.methods.encryptPassword = function(password, salt){
    if (!password || !salt){
        return false;
    } else {
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    }
};
// Get the user's public details
userSchema.methods.getProfile = function(){
    return {
        id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email
    };
};
// Merge a new user data into the current one
userSchema.methods.merge = function(newUser, callback){
    this.firstName = newUser.firstName;
    this.lastName = newUser.lastName;
    this.email = newUser.email;
    this.password = this.encryptPassword(newUser.password, this.salt);

    callback();
};

module.exports = mongoose.model('User', userSchema);