'use strict';

var Sync = angular.module('myApp.SyncView', []);

Sync.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/syncView', {
            templateUrl: 'sync_components/sync.html',
            controller: 'SyncCtrl'
        });
    }]);

Sync.controller('SyncCtrl', ['$scope', '$location', 'AppDB', 'WebService', '_', '$http', 'cfpLoadingBar', 'toastr', function ($scope, $location, AppDB, webService, _, $http, cfpLoadingBar, toastr) {

        $scope.onSyncData = function () {

            var _webServiceUrl = webService.getUrl();

            toastr.info('url : ' + _webServiceUrl, 'Network Information', {
                timeOut: 5000
            });

            //check if database instance is null
            if (_.isNull(AppDB) || _.isUndefined(AppDB))
                return;

            //check if database is null
            if (_.isNull(AppDB._cameraAppDB) || _.isUndefined(AppDB._cameraAppDB))
                return;

            if (!_.isNull(_webServiceUrl) && !_.isUndefined(_webServiceUrl)) {

                //show the loading bar
                cfpLoadingBar.start();

                //drop TABLE [* INSPECTOR]
                AppDB.dropInspectorTable();

                //create TABLE [* INSPECTOR]
                AppDB.createInspectorTable();

                var _syncUrl = _webServiceUrl + 'GetInspectorData';

                var _response = $http.get(_syncUrl);

                //callback from web service [* success]
                _response.success(function (data) {
                    //parse to JSON format
                    var _syncData = JSON.parse(data);

                    //@insert operation
                    //@insert on synced finished from the server
                    for (var i = 0; i < _syncData.length; i++) {

                        var _syncedData = _syncData[i];

                        var _userName = _.isNull(_syncedData.UserName) ? "" : _syncedData.Username;

                        var _fullName = _syncedData.FullName;

                        var _passWord = _syncedData.Password;

                        var _code = _syncedData.Code;

                        var _id = _syncedData.ID;

                        AppDB._cameraAppDB.executeSql("INSERT INTO INSPECTOR (ID, Code, FullName, UserName, Password) VALUES (?, ?, ?, ?, ?)", [_id, _code, _fullName, _userName, _passWord], function (tx, res) {
                            //insert success

                            toastr.success('Inspector data synced!', 'Information', {
                                timeOut: 5000
                            });

                            var _loginViewPath = '/loginView';
                            //change page to login view page
                            $location.path(_loginViewPath).replace();
                        }, function (e) {
                            toastr.error(e.message, 'Error', {
                                timeOut: 5000
                            });
                        });
                    }
                    ;

                    //hide the loading bar
                    cfpLoadingBar.complete();
                });

                //callback from web service [* error]
                _response.error(function (data, status, headers, config) {
                    //hide the loading bar
                    cfpLoadingBar.complete();

                    toastr.error('Could not call web service', 'Error', {
                        timeOut: 5000
                    });
                });
            }
        };
    }]);