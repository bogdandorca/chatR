angular.module('app', ['ngRoute']).config(function($routeProvider, $locationProvider){
    $routeProvider
        .when('/', {
            templateUrl: './partials/home',
            controller: 'HomeCtrl'
        })
        .otherwise({
            templateUrl: './partials/404'
        });
    $locationProvider.html5Mode(true);
});