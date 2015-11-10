var gulp = require('gulp'),
    inject = require('gulp-inject'),
    bowerFiles = require('main-bower-files'),
    chalk = require('chalk'),
    argv = require('yargs').argv;

// Template Variables

var templateFolder = './public/template/',
    layout = gulp.src(templateFolder + 'layout.jade'),
    scripts = gulp.src(templateFolder + 'scripts.jade');
    ignorePath = {
        ignorePath: '/public'
    };

// Bower injector
var bowerSources = gulp.src(bowerFiles(), {read: false, base: ''}),
    bowerConfig = {
        name: 'bower',
        ignorePath: '/public'
    };

// CSS Injector
var cssFile,
    cssLocation = './public/assets/styles/';
argv.production ? cssFile = cssLocation + 'global.min.css' : cssFile = cssLocation + 'global.css';
var cssSources = gulp.src(cssFile, {read: false});

// JS Injector
var jsFile,
    jsLocation = './public/app/';
argv.production ? jsFile = jsLocation + 'app.min.js' : jsFile = jsLocation + 'app.js';
var jsSources = gulp.src(jsFile, {read: false, relative: true});

var injector = function(){
    console.log(chalk.cyan('Injecting dependencies...'));

    layout
        .pipe(inject(cssSources, ignorePath))
        .pipe(inject(bowerSources, bowerConfig))
        .pipe(gulp.dest(templateFolder));
    scripts
        .pipe(inject(jsSources, ignorePath))
        .pipe(inject(bowerSources, bowerConfig))
        .pipe(gulp.dest(templateFolder));

    console.log(chalk.green('Dependencies injected'));
};

module.exports = injector;