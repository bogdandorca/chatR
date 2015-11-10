var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    chalk = require('chalk'),
    livereload = require('gulp-livereload'),
    argv = require('yargs').argv,
    gulpif = require('gulp-if'),
    stripDebug = require('gulp-strip-debug');

var filename;
argv.production ? filename = 'app.min.js' : filename = 'app.js';


var clientScripts = function(){
    console.log(chalk.cyan('Processing Public JavaScript files...'));

    gulp.src(['./public/app/*.module.js', './public/app/**/*.js', '!./public/app/app.js', '!./public/app/app.min.js'])
        .pipe(concat(filename))
        .pipe(gulpif(argv.production, stripDebug()))
        .pipe(gulpif(argv.production, uglify({
            mangle: false
        })))
        .pipe(gulp.dest('./public/app/'))
        .pipe(livereload());

    console.log(chalk.green('Client files processed'));
};

module.exports = clientScripts;