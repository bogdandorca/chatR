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