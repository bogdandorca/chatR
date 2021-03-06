var passport = require('passport'),
    responseApi = require('response-api'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('../models/user.model');

module.exports = {
	// Serialize user data for session initialization
	serializeUser: function(){
		passport.serializeUser(function(user, done){
	        done(null, user._id);
	    });
	},
	// Deserialize user data to get the user's details based on the session
	deserializeUser: function(){
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
	},
	/**
	* Local Strategy
	**/
	initLocalStrategy: function(){
		// Get the user's details from the 'login' request
		// And check if the user with the provided credentials does exist
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
                        console.log('asd');
	                    done(null, null);
	                } else {
	                    done(null, user);
	                }
	            });
	        }
	    ));

	    this.serializeUser();
	    this.deserializeUser();
	},
	isAuthorized: function(req, res, next){
		if(req.isAuthenticated()){
			next();
		} else {
			res.send(responseApi.error('Not authorized', 401, req.user));
		}
	}
};