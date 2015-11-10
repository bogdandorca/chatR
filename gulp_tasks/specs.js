var argv = require('yargs').argv,
    TestServer = require('karma').Server;

var test = function(done){
    /*  Flags:
     none: Starts Karma as a continuous test runner
     --once : Runs test only once, instead of providing the default continuous runner
     */
    new TestServer({
        configFile: __dirname +'//../karma.conf.js',
        singleRun: argv.once
    }, done).start();
};

module.exports = test;