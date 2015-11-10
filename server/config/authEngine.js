var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/user.model');

module.exports = function(){
    passport.use(new LocalStrategy(
        function(email, password, done){
            User.findOne({
                email: email,
                password: password
            }, function(err, user){
                if(err) { return done(err); }
                if(!user) {
                    return done(null, false, {
                        message: 'Incorrect email'
                    });
                }
                if(!user.hasValidPassword(password)) {
                    return done(null, false, {
                        message: 'Incorrect password'
                    });
                }

                return done(null, user);
            });
        }
    ));
};