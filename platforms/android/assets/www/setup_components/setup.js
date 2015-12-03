'use strict';

var Setup = angular.module('myApp.SetupView', []);

Setup.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/setupView', {
            templateUrl: 'setup_components/setup.html',
            controller: 'SetupCtrl'
        });
    }]);

Setup.controller('SetupCtrl', ['$scope', '$location', 'AppDB', '_', 'toastr', 'WebService', '$http', 'cfpLoadingBar', function ($scope, $location, AppDB, _, toastr, webService, $http, cfpLoadingBar) {

        $scope.onNWSetup = function () {

            //start the loading bar
            cfpLoadingBar.start();

            var _nwAddress = $scope.nwAddress;

            var _lastSync = new Date();

            if (_.isNull(_nwAddress) || _.isUndefined(_nwAddress))
                //network address is blank [* required field]
                toastr.error('Please input your network address', 'Error', {
                    timeOut: 5000
                });
            else {

                //insert data into TABLE [* SETUP]
                var _onInsertSucceed = function (results) {

                    toastr.success('Setup network complete!', 'Network', {
                        timeOut: 5000
                    });

                    $scope.$apply(function () {
                        $location.path(_syncViewPath).replace();
                    });
                };

                var _onInsertFailed = function (e) {

                    toastr.error(e.message, 'Error', {
                        timeOut: 5000
                    });
                };

                //sync view path
                var _syncViewPath = '/syncView';

                webService.setUrl(_nwAddress);

                var _isConnectUrl = webService.getUrl() + 'IsConnect';

                var _response = $http.get(_isConnectUrl);

                //callback from web service [* success]
                _response.success(function (data) {
                    //parse to JSON format
                    var _connectData = JSON.parse(data);

                    alert(JSON.stringify(_connectData));

                    //hide the loading bar
                    cfpLoadingBar.complete();

                    if (_connectData.IsConnect === true) {

                        AppDB.dropSetupTable();

                        AppDB.createSetupTable();

                        AppDB._cameraAppDB.executeSql("INSERT INTO SETUP (NetworkAddr, LastSync) VALUES (?, ?)", [_nwAddress, _lastSync.getTime()], _onInsertSucceed, _onInsertFailed);

                    } else {

                        toastr.error('Web service is not connected', 'Error', {
                            timeOut: 5000
                        });
                    }
                });

                //callback from web service [* error]
                _response.error(function (data, status, headers, config) {
                    //hide the loading bar
                    cfpLoadingBar.complete();

                    toastr.error('Could not connect to web service', 'Error', {
                        timeOut: 5000
                    });
                });
            }
        };
    }]);