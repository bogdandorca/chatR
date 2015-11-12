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