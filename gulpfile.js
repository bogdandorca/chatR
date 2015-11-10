var gulp = require('gulp'),
    watch = require('gulp-watch'),
    chalk = require('chalk'),
    livereload = require('gulp-livereload'),
    argv = require('yargs').argv,
    runSequence = require('gulp-run-sequence');

// Personal modules
var config = require('./config.js').development,
    clientScripts = require('./gulp_tasks/clientScripts.js'),
    lint = require('./gulp_tasks/lint.js'),
    specs = require('./gulp_tasks/specs.js'),
    styles = require('./gulp_tasks/styles.js'),
    server = require('./gulp_tasks/server.js'),
    injector = require('./gulp_tasks/injector.js'),
    clean = require('./gulp_tasks/clean.js'),
    open = require('open');

// The environment is determined by the '--production' flag
var environment;
argv.production ? environment = 'production' : environment = 'development';

gulp.task('default', function(){
    runSequence('clean', ['lint', 'clientScripts', 'styles'], 'build', 'server', 'open');
    /*  Flags:
     none: Task automation for development (JSLinter, JSConcat, Sass, CSS-Prefixer), starts the server and livereload
     --production: Adds to the default suite: JS Uglify, JS Strip Debug, CSS Minify
     --browse: Opens the browser with the website
     */
    console.log(chalk.cyan('Getting ready for the '+environment + ' environment...'));

    livereload.listen(35729);
    // Scripts
    watch(['./public/app/**/*.js', '!./public/app/app.js', '!./public/app/app.min.js', './server/**/*.js'], lint);
    watch(['./public/app/**/*.js', '!./public/app/app.js', '!./public/app/app.min.js'], clientScripts);
    // Styles
    watch('./public/assets/styles/**/*.scss', styles);

    console.log(chalk.green('The '+environment+' environment is ready.'));
});

// Server
gulp.task('server', server);
gulp.task('open', function(){
    if(argv.browse) open('http://localhost:'+config.port);
});
// Clean
gulp.task('clean', clean);
// Scripts
gulp.task('lint', lint);
gulp.task('clientScripts', clientScripts);
// Styles
gulp.task('styles', styles);
// Injector
gulp.task('build', injector);
// Test
gulp.task('test', specs);