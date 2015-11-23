var passport = require('passport'),
    expressSession = require('express-session'),
    sessionStore = require('sessionstore').createSessionStore(),
    cookieParser = require('cookie-parser'),
    config = require('./app.config'),
    passportSocketIo = require("passport.socketio"),
    UserController = require('../controllers/auth.controller');

module.exports = function(app, io){
    // Express session
    app.use(expressSession({
        store: sessionStore,
        secret: config.secret,
        key: 'express.sid',
        resave: false,
        saveUninitialized: false
    }));

    // Passport
    app.use(passport.initialize());
    app.use(passport.session());

    UserController.initLocalStrategy();
    UserController.initFacebookStrategy();

    // Io authentication
    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        key: 'express.sid',
        secret: config.secret,
        store: sessionStore,
        success: socketAuthSuccess,
        fail: socketAuthError
    }));
    function socketAuthSuccess(data, accept) {
        accept();
    }
    function socketAuthError(data, message, error, accept) {
        // log the error
    }
};