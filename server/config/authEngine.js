var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/user.model');

/**
* Local Strategy
**/
var initLocalStrategy = function(){
    passport.use(new LocalStrategy.Strategy(
        function(username, password, done){
            User.findOne({
                email: username
            },
            function(err, user) {
                if(err) { done(err, null); }

                // If the request was successfull
                if(!user) {
                    done(null, null);
                } else if(!user.hasValidPassword(password)){
                    done(null, null);
                } else {
                    done(null, user);
                }
            });
        }
    ));

    passport.serializeUser(function(user, done){
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done){
        User.findOne({
            _id: id
        },
        function(err, user) {
            if(err){ done(err, null); }

            if(!user){
                done(null, null);
            } else {
                done(null, user.getProfile());
            }
        });
    });
};

module.exports = function(app){
    app.use(passport.initialize());
    app.use(passport.session());

    initLocalStrategy();
};