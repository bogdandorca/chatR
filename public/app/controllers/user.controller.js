angular.module('app').controller('UserCtrl', function($scope, $location, AuthService){
    $scope.displayLoadingScreen = true;

    // When the UserService is initialized, remove the loading screen
    AuthService.registerObserverCallback(function(user){
        $scope.displayLoadingScreen = false;
    });
});