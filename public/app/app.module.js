angular.module('app', ['ngRoute']).config(function($routeProvider, $locationProvider){
    $routeProvider
        .when('/login', {
            templateUrl: './partials/login',
            controller: 'LoginCtrl'
        })
        .when('/register', {
            templateUrl: './partials/register',
            controller: 'RegisterCtrl'
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
angular.module('app').run(function($rootScope, $location, AuthService){
    var publicPages = ['/login', '/register'];
    AuthService.initialize().then(function(){
        if(AuthService.user && publicPages.indexOf($location.path()) >= 0){
            $location.path('/');
        }
    });
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        if(AuthService.user && publicPages.indexOf(next.$$route.originalPath) >= 0){
            $location.path('/');
        } else if(!AuthService.user && publicPages.indexOf(next.$$route.originalPath) < 0){
            $location.path('/login');
        }
    });
});