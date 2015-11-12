var express = require('express'),
	Router = express.Router(),
	passport = require('passport'),
    responseApi = require('response-api'),
	moment = require('moment');

module.exports = function(app){
	Router.route('/login')
		.post(passport.authenticate('local'), function(req, res){
	    	res.send(responseApi.success('Logged In', req.user.getProfile(), req.user));
	    });
	 Router.route('/logout')
		 .get(function(req, res){
	    	req.logout();
	    	res.send(responseApi.success('Logged Out', null, req.user));
	    });
	Router.route('/test')
		.get(function(req, res){
            res.send(responseApi.success('Test successful', null, req.user));
	    });

    app.use('/auth', Router);
};