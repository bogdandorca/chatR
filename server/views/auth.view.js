var express = require('express'),
	Router = express.Router(),
	passport = require('passport'),
	moment = require('moment');

module.exports = function(app){
	Router.route('/login')
		.post(passport.authenticate('local'), function(req, res){
	    	res.send({
	    		timestamp: moment().format('x'),
	    		hasSession: (req.user !== undefined && req.user !== null)
	    	});
	    });
	 Router.route('/logout')
		 .get(function(req, res){
	    	req.logout();
	    	res.send({
	    		timestamp: moment().format('x'),
	    		hasSession: (req.user !== undefined && req.user !== null)
	    	});
	    });
	Router.route('/test')
		.get(function(req, res){
	    	res.send({
	    		timestamp: moment().format('x'),
	    		hasSession: (req.user !== undefined && req.user !== null)
	    	});
	    });

    app.use('/auth', Router);
};