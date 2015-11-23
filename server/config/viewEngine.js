var express = require('express'),
    jade = require('jade'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    config = require('./app.config');

module.exports = function(app, sessionStore){
    app.set('views', './public/');
    app.set('view engine', 'jade');
    app.use(express.static('./public'));
    app.use(bodyParser.json({extended: true}));
    app.use(cookieParser());
};