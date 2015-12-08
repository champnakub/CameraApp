'use strict';

var Login = angular.module('myApp.LoginView', ['ngRoute']);

Login.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/loginView', {
            templateUrl: 'login_components/login.html',
            controller: 'LoginCtrl'
        });
    }]);

Login.controller('LoginCtrl', ['$scope', '$location', 'AppDB', 'toastr', function ($scope, $location, AppDB, toastr) {

        $scope.getProjectData = function () {

            var _onQuerySuccess = function (tx, results) {
                
                toastr.success('Length : ' + results.rows.length,  'Information', {
                    timeOut: 8000
                });
            };

            var _onQueryFailed = function (error) {

                toastr.error(error.message, 'Error', {
                    timeOut: 5000
                });
            };

            AppDB._cameraAppDB.transaction(function (tx) {

                tx.executeSql('SELECT * FROM PROJECT', [], _onQuerySuccess, _onQueryFailed);
            });
        };

        //@ Authentication
        $scope.authenticate = function () {

            //var _cameraViewPath = '/cameraView';
            //change page to camera view page
            //$location.path(_cameraViewPath);
        };
    }]);