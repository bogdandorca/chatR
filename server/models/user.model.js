var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    moment = require('moment');

var userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    creationDate: {
        type: String,
        default: moment('x')
    }
});

userSchema.methods.hasValidPassword = function(loginPassword){
    return (this.model.password === loginPassword);
};

module.exports = mongoose.model('User', userSchema);