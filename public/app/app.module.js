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