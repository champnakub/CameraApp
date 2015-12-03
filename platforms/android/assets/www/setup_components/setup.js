'use strict';

var Setup = angular.module('myApp.SetupView', []);

Setup.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/setupView', {
            templateUrl: 'setup_components/setup.html',
            controller: 'SetupCtrl'
        });
    }]);

Setup.controller('SetupCtrl', ['$scope', '$location', 'AppDB', '_', 'toastr', 'WebService', function ($scope, $location, AppDB, _, toastr, webService) {

        $scope.onNWSetup = function () {

            var _nwAddress = $scope.nwAddress;

            var _lastSync = new Date();

            if (_.isNull(_nwAddress) || _.isUndefined(_nwAddress))
                //network address is blank [* required field]
                toastr.error('Please input your network address', 'Error', {
                    timeOut: 5000
                });
            else {

                if (!_.isNull(AppDB._cameraAppDB) && !_.isUndefined(AppDB._cameraAppDB)) {
                    //insert data into TABLE [* SETUP]
                    var _onInsertSucceed = function (results) {

                        var _syncViewPath = '/syncView';
                                                
                        toastr.success('Setup network complete!', 'Network', {
                            timeOut: 5000
                        });
                        
                        webService.setUrl(_nwAddress);
                        
                        $scope.$apply(function () {
                            $location.path(_syncViewPath).replace();
                        });
                    };

                    var _onInsertFailed = function (e) {
                        toastr.error(e.message, 'Error', {
                            timeOut: 5000
                        });
                    };

                    AppDB._cameraAppDB.executeSql("INSERT INTO SETUP (NetworkAddr, LastSync) VALUES (?, ?)", [_nwAddress, _lastSync.getTime()], _onInsertSucceed, _onInsertFailed);
                }
            }
        };
    }]);