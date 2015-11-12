var User = require('../models/user.model'),
    responseApi = require('response-api');

module.exports = {
    get: function(req, res){
        User.findOne({ _id: req.user.id }, function(err, user){
            if(err) { res.send(responseApi.error('Server error', 500, req.user)); }

            if(!user){
                res.send(responseApi.error('Invalid account', 400, res.user));
            } else {
                res.send(responseApi.success('Account created', user.getProfile(), req.user));
            }
        });
    },
    create: function(req, res){
        var newUser = new User(req.body);
        // Check if all the required details are provided
        if(!newUser.isValid()) {
            res.send(responseApi.error('The details provided are invalid', 400, req.user));
        } else {
            // Check if the email does not already exist
            User.findOne({ email: newUser.email }, function(err, user){
                if(err) { res.send(responseApi.error('Server error', 500, req.user)); }

                if(user && user.email === newUser.email){
                    res.send(responseApi.error('This email already has an account associated with it', 400, res.user));
                } else {
                    // Add the user to the database
                    newUser.save(function(err, user){
                        if(err) { res.send(responseApi.error('Server error', 500, req.user)); }

                        if(!user){
                            res.send(responseApi.error('We were unable to create an account using those details. Please revise them and try again.', 400, res.user));
                        } else {
                            // Login the user before sending the response
                            req.login(user, function(err){
                                if(err) {
                                    res.send(responseApi.error('Server error', 500, req.user));
                                } else {
                                    res.send(responseApi.success('Account created', user.getProfile(), req.user));
                                }
                            });
                        }
                    });
                }
            });
        }
    },
    delete: function(req, res){
        User.findOne({_id: req.user.id}, function(err, user){
            if(err) { res.send(responseApi.error('Server error', 500, req.user)); }

            if(!user) {
                res.send(responseApi.error('Invalid account', 400, res.user));
            } else {
                User.remove({_id: user._id}, function(err) {
                    if(err){
                        res.send(responseApi.error('Server error', 500, req.user));
                    } else {
                        req.logout();
                        res.send(responseApi.success('Account deleted', null, req.user));
                    }
                });
            }
        });
    },
    mergeAndUpdate: function(req, res, user, newUser){
        user.merge(newUser, function() {
            // Delete ID so it will not be updated
            var userId = user._id;
            delete user._id;

            User.update({_id: userId}, {$set: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    password: user.password
                }},
                function(err, result){
                if(err) { res.send(responseApi.error('Server error', 500, req.user)); }

                if(!result.nModified) {
                    res.send(responseApi.error('We were unable to update your account using those details. Please revise them and try again.', 400, res.user));
                } else {
                    res.send(responseApi.success('Updated account', user.getProfile(), req.user));
                }
            });
        });
    },
    update: function(req, res){
        var that = this;
        var newUser = new User(req.body);
        User.findOne({ _id: req.user.id }, function(err, user){
            if(err) { res.send(responseApi.error('Server error', 500, req.user)); }

            if(!user){
                res.send(responseApi.error('Invalid account', 400, res.user));
            } else {
                if(!newUser.isValid()){
                    res.send(responseApi.error('The details provided are invalid', 400, req.user));
                } else if(user.email !== newUser.email) {
                    User.findOne({email: newUser.email}, function(err, duplicateUser){
                        if(err) { res.send(responseApi.error('Server error', 500, req.user)); }

                        // If there is another user with the same email address
                        if(duplicateUser){
                            res.send(responseApi.error('Email already exists', 400, req.user));
                        } else {
                            that.mergeAndUpdate(req, res, user, newUser);
                        }
                    });
                } else {
                    that.mergeAndUpdate(req, res, user, newUser);
                }
            }
        });
    }
};