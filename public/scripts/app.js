'use strict';

/**
 * @ngdoc overview
 * @name cbDemoQaApp
 * @description
 * # 'cb-ts-demo
 *
 * Main module of the application.
 */
var app = angular.module('cb-ts-demo', [
    'ngCookies',
    'ngResource',
    'ngRoute'
]);

app.config(function($routeProvider) {
   
    
    $routeProvider
    //-- cean: Routes
    .when('/', {
       templateUrl : 'views/main.html',
       controller : 'MyCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });
});
