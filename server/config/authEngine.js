var passport = require('passport'),
    UserController = require('../controllers/auth.controller');

module.exports = function(app){
    app.use(passport.initialize());
    app.use(passport.session());

    UserController.initLocalStrategy();
    UserController.initFacebookStrategy();
};