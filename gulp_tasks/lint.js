var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    chalk = require('chalk');

var lint = function(){
    console.log(chalk.cyan('Processing JavaScript files...'));

    gulp.src(['./public/app/**/*.js', './server/**/*.js', '!./public/app/app.js', '!./public/app/app.min.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
};

module.exports = lint;