angular.module('app', ['ngRoute']).config(function($routeProvider, $locationProvider){
    $routeProvider
        .when('/login', {
            templateUrl: './partials/login',
            controller: 'LoginCtrl'
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
angular.module('app').run(function($rootScope, $location, UserService){
    var publicPages = ['/login'];
    UserService.initialize().then(function(){
        if(UserService.user && $location.path().indexOf(publicPages) >= 0){
            $location.path('/');
        }
    });
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        if(UserService.user && next.$$route.originalPath.indexOf(publicPages) >= 0){
            $location.path('/');
        } else if(!UserService.user && next.$$route.originalPath.indexOf(publicPages) < 0){
            $location.path('/login');
        }
    });
});
angular.module('app').controller('HeaderCtrl', function($scope, $location, UserService){
    $scope.displayUserElement = false;

    $scope.logOut = function(){
        UserService.logout().then(function(){
            $scope.displayUserElement = false;
            $location.path('/login');
        }, function(){
            alert('Could not log out!!!');
        });
    };

    // When the User logs in, add the required elements
    UserService.registerObserverCallback(function(){
        if(UserService.user){
            $scope.displayUserElement = true;
        }
    });
});
angular.module('app').controller('HomeCtrl', function($scope){
    $scope.message = 'Home Partial';
});
angular.module('app').controller('LoginCtrl', function($scope, $location, UserService){
    $scope.credentials = {
        username: null,
        password: null
    };
    $scope.error = null;

    $scope.login = function(){
        UserService.login($scope.credentials)
            .then(function(response){
                $scope.error = null;
                $location.path('/');
            }, function(){
                $scope.error = 'The credentials provided are invalid.';
            });
    };
});
angular.module('app').controller('UserCtrl', function($scope, $location, UserService){
    $scope.displayLoadingScreen = true;

    // When the UserService is initialized, remove the loading screen
    UserService.registerObserverCallback(function(user){
        $scope.displayLoadingScreen = false;
    });
});
angular.module('app').factory('UserService', function($http, $q){
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
            return user;
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
                    that.user = null;
                    deferred.resolve();
                }, function(){
                    deferred.reject();
                });
            return deferred.promise;
        }
    };
});