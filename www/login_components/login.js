'use strict';

var Login = angular.module('myApp.LoginView', ['ngRoute']);

Login.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/loginView', {
            templateUrl: 'login_components/login.html',
            controller: 'LoginCtrl'
        });
    }]);

Login.controller('LoginCtrl', ['$scope', '$location', function ($scope, $location) {

        //@ Authentication
        $scope.authenticate = function () {

            //var _cameraViewPath = '/cameraView';
            //change page to camera view page
            //$location.path(_cameraViewPath);
        };
    }]);