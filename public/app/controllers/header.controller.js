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