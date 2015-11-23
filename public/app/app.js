angular.module('app', ['ngRoute']).config(function($routeProvider, $locationProvider){
    $routeProvider
        .when('/login', {
            templateUrl: './partials/login',
            controller: 'LoginCtrl'
        })
        .when('/register', {
            templateUrl: './partials/register',
            controller: 'RegisterCtrl'
        })
        .when('/', {
            templateUrl: './partials/home',
            controller: 'HomeCtrl'
        })
        .otherwise({
            templateUrl: './partials/404'
        });
    $locationProvider.html5Mode(true);
});
angular.module('app').run(function($rootScope, $location, AuthService){
    var publicPages = ['/login', '/register'];
    AuthService.initialize().then(function(){
        if(AuthService.user && publicPages.indexOf($location.path()) >= 0){
            $location.path('/');
        }
    });
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        if(AuthService.user && publicPages.indexOf(next.$$route.originalPath) >= 0){
            $location.path('/');
        } else if(!AuthService.user && publicPages.indexOf(next.$$route.originalPath) < 0){
            $location.path('/login');
        }
    });
});
angular.module('app').controller('HeaderCtrl', function($scope, $location, AuthService){
    $scope.displayUserElement = false;

    $scope.logOut = function(){
        AuthService.logout().then(function(){
            $scope.displayUserElement = false;
            $location.path('/login');
        }, function(){
            alert('Could not log out!!!');
        });
    };

    // When the User logs in, add the required elements
    AuthService.registerObserverCallback(function(){
        if(AuthService.user){
            $scope.displayUserElement = true;
        }
    });
});
angular.module('app').controller('HomeCtrl', function($scope){
    $scope.message = 'Home Partial';
});
angular.module('app').controller('LoginCtrl', function($scope, $location, AuthService){
    $scope.credentials = {
        username: null,
        password: null
    };
    $scope.error = null;

    $scope.login = function(){
        AuthService.login($scope.credentials)
            .then(function(response){
                $scope.error = null;
                $location.path('/');
            }, function(){
                $scope.error = 'The credentials provided are invalid.';
            });
    };
});
angular.module('app').controller('RegisterCtrl', function($scope, $location, UserService){
    $scope.emailConfirmation = null;
    $scope.passwordConfirmation = null;
    $scope.user = {
        firstName: null,
        lastName: null,
        email: null,
        password: null
    };

    var emailsMatch = function(){
        return $scope.emailConfirmation === $scope.user.email;
    };
    var passwordsMatch = function(){
        return $scope.passwordConfirmation === $scope.user.password;
    };
    var detailsAreValid = function(){
        return (validator.isAlpha($scope.user.firstName) && validator.isLength($scope.user.firstName, 2, 50) &&
        validator.isAlpha($scope.user.lastName) && validator.isLength($scope.user.lastName, 2, 50) &&
        validator.isEmail($scope.user.email) && validator.isLength($scope.user.email, 5, 30) &&
        validator.isLength($scope.user.password, 6, 30));
    };

    $scope.register = function(){
        console.log(detailsAreValid());
        console.log(emailsMatch());
        console.log(passwordsMatch());
        if(detailsAreValid() && emailsMatch() && passwordsMatch()){
            UserService.create($scope.user)
                .then(function(responseMessage){
                    // Confirm the registration
                    $location.path('/');
                });
        } else {
            // Inform the user regarding the error
        }
    };
});
angular.module('app').controller('UserCtrl', function($scope, $location, AuthService){
    $scope.displayLoadingScreen = true;

    // When the UserService is initialized, remove the loading screen
    AuthService.registerObserverCallback(function(user){
        $scope.displayLoadingScreen = false;
    });
});
angular.module('app').controller('UserListCtrl', function($scope, SocketService, AuthService){
    $scope.users = [];

    // Initialize the Online User List
    SocketService.socket.on('initOnlineUserList', function(onlineUserList){
        angular.forEach(onlineUserList, function(value, key){
            if(value.email !== AuthService.get().email){
                $scope.users.push(value);
            }
        });
        $scope.$apply();
    });

    // Add new user to the Online List
    SocketService.socket.on('userConnected', function(msg){
        var newUser = msg.success.object;
        var newUserObject = {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            isOnline: newUser.logged_in
        };

        if(newUserObject.email !== AuthService.get().email){
            var userExists = false;
            angular.forEach($scope.users, function(value, key){
                if(value.email === newUserObject.email){
                    // If the user is not online, push as online
                    if(value.isOnline !== true){
                        $scope.users[key].isOnline = true;
                        $scope.$apply();
                    } else {
                        userExists = true;
                    }
                }
            });
            if(!userExists){
                $scope.users.push(newUserObject);
                $scope.$apply();
            }
        }
    });

    // Disconnect a user
    SocketService.socket.on('userDisconnected', function(user){
        angular.forEach($scope.users, function(value, key){
            if(value.email === user.success.object.email){
                $scope.users.splice(key, 1);
                $scope.$apply();
            }
        });
    });
});
angular.module('app').factory('AuthService', function($http, $q, SocketService){
    return {
        user: null,

        // Observers
        observerCallbacks: [],
        registerObserverCallback: function(callback){
            this.observerCallbacks.push(callback);
        },
        notifyObservers: function(){
            angular.forEach(this.observerCallbacks, function(callback){
                callback(this.user);
            });
        },

        get: function(){
            return this.user;
        },
        set: function(user){
            this.user = user;
            this.notifyObservers();
        },
        initialize: function(){
            var deferred = $q.defer();
            if(!this.user) {
                var that = this;
                $http.get('/auth/user')
                    .then(
                        function (response) {
                            var data = response.data;
                            if (data.success) {
                                that.user = data.success.object;
                                SocketService.init();
                            }
                            that.notifyObservers();
                            deferred.resolve();
                        }, function(){
                            that.notifyObservers();
                            deferred.resolve();
                        });
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        },
        login: function(credentials){
            var that = this;
            var deferred = $q.defer();
            $http.post('/auth/login', credentials)
                .then(function(response){
                    var data = response.data;
                    if(data.error){
                        deferred.reject();
                    } else {
                        that.user = data.success.object;
                        deferred.resolve(data.success.message);
                        SocketService.init();
                    }
                    // Notify the observers
                    that.notifyObservers();
                }, function(){
                    that.notifyObservers();
                    deferred.reject();
                });
            return deferred.promise;
        },
        logout: function(){
            var that = this;

            var deferred = $q.defer();
            $http.get('/auth/logout')
                .then(function(){
                    // Reset user object
                    SocketService.socket.emit('disconnectClient');
                    that.user = null;
                    deferred.resolve();
                }, function(){
                    deferred.reject();
                });
            return deferred.promise;
        }
    };
});
angular.module('app').factory('SocketService', function(){
    return {
        socket: null,
        init: function(){
            if(!this.socket){
                this.socket = io();
            }
        }
    };
});
angular.module('app').factory('UserService', function($http, $q, AuthService){
    return {
        create: function(user){
            var deferred = $q.defer();
            $http.post('/auth/user', user)
                .then(
                    function(response){
                        var data = response.data;

                        // Login
                        AuthService.set(data.success.object);

                        deferred.resolve(data.success.message);
                    },
                    function(error){
                        var data = error.data;
                        deferred.reject(data.error.message);
                    }
                );
            return deferred.promise;
        }
    };
});