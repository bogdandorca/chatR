var express = require('express'),
    chalk = require('chalk'),
    mongoose = require('mongoose'),
    env = process.env.NODE_ENV || 'development';

// Config
var app = express(),
    config = require('../config.js')[env];
require('./config/viewEngine')(app);
require('./config/authEngine');

// Database
mongoose.connect(config.database);
console.log(chalk.green.bold('Database connection established'));

// Views
require('./views/auth.view')(app);
require('./views/public.view')(app);

app.listen(config.port);
console.log('Application started on port ' + chalk.green.bold(config.port.toString()));