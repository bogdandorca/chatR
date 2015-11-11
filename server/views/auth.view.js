var passport = require('passport'),
	moment = require('moment');

module.exports = function(app){
    app.post('/auth/login', passport.authenticate('local'), function(req, res){
    	res.send({
    		timestamp: moment().format('x'),
    		hasSession: (req.user !== undefined && req.user !== null)
    	});
    });
    app.get('/auth/logout', function(req, res){
    	req.logout();
    	res.send({
    		timestamp: moment().format('x'),
    		hasSession: (req.user !== undefined && req.user !== null)
    	});
    });
    app.get('/auth/test', function(req, res){
    	res.send({
    		timestamp: moment().format('x'),
    		hasSession: (req.user !== undefined && req.user !== null)
    	});
    });
};