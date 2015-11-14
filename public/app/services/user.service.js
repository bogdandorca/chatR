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