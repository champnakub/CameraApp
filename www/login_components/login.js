'use strict';

var Login = angular.module('myApp.LoginView', ['ngRoute', 'ngTouch']);

Login.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/loginView', {
            templateUrl: 'login_components/login.html',
            controller: 'LoginCtrl'
        });
    }]);

Login.controller('LoginCtrl', ['$scope', '$location', 'AppDB', 'toastr', 'User', 'WebService', '_', '$http', function ($scope, $location, AppDB, toastr, User, WebService, _, $http) {

        //for test case scenrario
        $scope.getProjectData = function () {

            var _onQuerySuccess = function (tx, results) {

                toastr.success('Length : ' + results.rows.length, 'Information', {
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

        //for test case scenario
        $scope.pushDefectedData = function () {

            WebService.setUrl('beau888.dyndns.org');

            var _pushDefectedUrl = WebService.getUrl() + 'PushDefected';

            var _onQuerySuccess = function (tx, results) {

                var _defectedResults = [];

                for (var i = 0; i < results.rows.length; i++) {
                    _defectedResults.push(results.rows.item(i));
                }

                //alert(JSON.stringify(_defectedResults));

                var _data = {
                    _JsonData: JSON.stringify(_defectedResults)
                };

                $http.post(_pushDefectedUrl, _data).then(function () {

                    //success callback after calling webservice
                    toastr.success('Post to server complete!', 'Information', {
                        timeOut: 5000
                    });

                }, function () {

                    //error callback after calling webservice
                    toastr.error('Post to server failed!', 'Information', {
                        timeOut: 5000
                    });
                });
            };

            var _onQueryFailed = function (error) {

                toastr.error(error.message, 'Error', {
                    timeOut: 5000
                });
            };

            AppDB._cameraAppDB.transaction(function (tx) {

                tx.executeSql('SELECT * FROM Defected Where NewRecord = ?;', [1], _onQuerySuccess, _onQueryFailed);
            });
        };

        //@ Authentication
        $scope.authenticate = function () {

            var _userName = $scope.username;

            var _password = $scope.password;

            //login success
            var _onQuerySuccess = function (tx, results) {

                var _inspectorDatas = results;

                if (_inspectorDatas.rows.length >= 1) {

                    var _inspectorData = _inspectorDatas.rows.item(0);

                    User.setFullName(_inspectorData.FullName);

                    User.setID(_inspectorData.ID);

                    var _projectViewPath = '/projectView';
                    //change page to project view page
                    $scope.$apply(function () {
                        $location.path(_projectViewPath);
                    });
                } else {

                    toastr.error('Authorize failed', 'Error', {
                        timeOut: 5000
                    });
                }
            };

            //login failed
            var _onQueryFailed = function () {

                toastr.error('Authorize failed', 'Error', {
                    timeOut: 5000
                });
            };

            AppDB._cameraAppDB.transaction(function (tx) {

                tx.executeSql('SELECT ID , FULLNAME FROM INSPECTOR Where UserName = ? And Password = ?;', [_userName, _password], _onQuerySuccess, _onQueryFailed);
            });
        };
    }]);