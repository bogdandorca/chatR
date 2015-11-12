var express = require('express'),
    Router = express.Router(),
    moment = require('moment'),
    responseApi = require('response-api'),
    UserController = require('../controllers/user.controller'),
    AuthController = require('../controllers/auth.controller');

module.exports = function(app){
    Router.route('/user')
        .get(AuthController.isAuthorized, function(req, res){
            UserController.get(req, res);
        })
        .post(function(req, res){
            UserController.create(req, res);
        })
        .put(AuthController.isAuthorized, function(req, res){
            UserController.update(req, res);
        })
        .delete(AuthController.isAuthorized, function(req, res){
            UserController.delete(req, res);
        });

    app.use('/auth', Router);
};