var nodemon = require('gulp-nodemon');

var mainDirectory = __dirname +'//../';

var server = function(){
    nodemon({
        script: mainDirectory + 'server/index.js',
        ignore: [mainDirectory + 'gulp_tasks', mainDirectory + 'public/'],
        env: { 'NODE_ENV': 'development' }
    });
};

module.exports = server;