var gulp = require('gulp'),
    clean = require('gulp-clean');

var mainDirectory = './public';
var files = [
    mainDirectory + '/assets/styles/global.min.css',
    mainDirectory + '/assets/styles/global.css',
    mainDirectory + '/app/app.min.js',
    mainDirectory + '/app/app.js'
];

var globalClean = function(){
    gulp.src(files)
        .pipe(clean());
};

module.exports = globalClean;