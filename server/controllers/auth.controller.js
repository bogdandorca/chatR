var passport = require('passport'),
    responseApi = require('response-api'),
	LocalStrategy = require('passport-local').Strategy,
	FacebookStrategy = require('passport-facebook').Strategy,
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

	                // If the request was successful
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
	initFacebookStrategy: function(){
		passport.use(new FacebookStrategy({
			clientID: '1177613452253038',
			clientSecret: '9a3f6bc663b2d77db573e9b78b08ca42',
			callbackURL: "http://localhost:5676/auth/facebook/callback",
			enableProof: false
		},
		function(accessToken, refreshToken, profile, done){
            console.log(profile);
			var user = new User({
				firstName: profile.givenName,
				lastName: profile.familyName,
				email: profile.email | this.firstName + this.lastName + "@facebook.com",
				password: "asd"
			});
            return done(null, user);
			//User.findOrCreate({ facebookId: profile.id }, function(err, user){
			//	return done(err, user);
			//});
		}));
	},
	isAuthorized: function(req, res, next){
		if(req.isAuthenticated()){
			next();
		} else {
			res.send(responseApi.error('Not authorized', 401, req.user));
		}
	}
};