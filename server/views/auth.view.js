var passport = require('passport');

module.exports = function(app){
    app.post('/auth/login', passport.authenticate('local', {

    }));
};