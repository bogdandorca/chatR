var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    moment = require('moment'),
    crypto = require('crypto');

/**
* Schema Definition
**/
var userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    salt: String,
    creationDate: {
        type: String,
        default: moment().format('x')
    }
});

/**
* Hooks
**/
userSchema.pre('save', function(next){
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
    }
};

module.exports = mongoose.model('User', userSchema);