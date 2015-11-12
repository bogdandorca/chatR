angular.module('app').controller('UserCtrl', function($scope, $location, UserService){
    $scope.displayLoadingScreen = true;

    // When the UserService is initialized, remove the loading screen
    UserService.registerObserverCallback(function(user){
        $scope.displayLoadingScreen = false;
    });
});