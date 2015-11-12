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