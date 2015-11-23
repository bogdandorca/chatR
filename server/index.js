var express = require('express'),
    chalk = require('chalk'),
    mongoose = require('mongoose'),
    env = process.env.NODE_ENV || 'development';

/**
* Config
**/
var app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    config = require('./config/app.config')[env];

/**
* Database Connection
**/
mongoose.connect(config.database, function(){
	console.log(chalk.green.bold('Database connection established'));
});

/**
* Engine config
**/
require('./config/viewEngine')(app);
require('./config/authEngine')(app, io);

/**
* Views
**/
require('./views/socket.view')(io);
require('./views/auth.view')(app);
require('./views/user.view')(app);
require('./views/public.view')(app);

/**
* Server
**/
http.listen(config.port, function(){
	console.log('Application started on port ' + chalk.green.bold(config.port.toString()));
});