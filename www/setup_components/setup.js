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

            var _nwAddress = $scope.nwAddress;

            var _lastSync = new Date();

            if (_.isNull(_nwAddress) || _.isUndefined(_nwAddress)) {
                //network address is blank [* required field]
                toastr.error('Please input your network address', 'Error', {
                    timeOut: 5000
                });

                return;
            } else {
                //start the loading bar
                cfpLoadingBar.start();

                //set url in WebService instance
                webService.setUrl(_nwAddress);

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

                var _isConnectUrl = webService.getUrl() + 'IsConnect';

                var _response = $http.get(_isConnectUrl, {
                    timeout: 30000
                });

                //callback from web service [* success]
                _response.success(function (data) {
                    //parse to JSON format
                    var _connectData = JSON.parse(data);

                    //hide the loading bar
                    cfpLoadingBar.complete();

                    if (_connectData.IsConnect === true) {

                        AppDB.dropSetupTable();

                        AppDB.createSetupTable();

                        AppDB._cameraAppDB.transaction(function (tx) {
                            
                            tx.executeSql("INSERT INTO SETUP (NetworkAddr, LastSync) VALUES (?, ?)", [_nwAddress, _lastSync.getTime()], _onInsertSucceed, _onInsertFailed);
                        });
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