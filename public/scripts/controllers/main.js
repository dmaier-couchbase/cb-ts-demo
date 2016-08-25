'use strict';

/**
 * @ngdoc function
 * @name cb-ts-demo.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cbDemoQaApp
 */
var app = angular.module('cb-ts-demo');

app.controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
