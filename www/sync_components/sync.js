'use strict';

var Sync = angular.module('myApp.SyncView', []);

Sync.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/syncView', {
            templateUrl: 'sync_components/sync.html',
            controller: 'SyncCtrl'
        });
    }]);

Sync.controller('SyncCtrl', ['$scope', '$location', 'AppDB', 'WebService', '_', '$http', 'cfpLoadingBar', 'toastr', '$q', function ($scope, $location, AppDB, WebService, _, $http, cfpLoadingBar, toastr, $q) {

        $scope.pushDefectedData = function () {

            // Set up the $q deferred object.
            var _deferred = $q.defer();

            var _pushDefectedUrl = WebService.getUrl() + 'PushDefected';

            var _onQuerySuccess = function (tx, results) {

                var _defected = [];

                for (var i = 0; i < results.rows.length; i++) {
                    _defected.push(results.rows.item(i));
                }

                //alert(JSON.stringify(_defectedResults));

                var _data = {
                    _JsonData: JSON.stringify(_defected)
                };

                $http.post(_pushDefectedUrl, _data).then(function (data) {

                    _deferred.resolve(data);

                    //success callback after calling webservice
                    toastr.success('Push Defected Data complete!', 'Information', {
                        timeOut: 5000
                    });

                }, function (data) {

                    _deferred.resolve();

                    //error callback after calling webservice
                    toastr.error('Post to server failed!', 'Information', {
                        timeOut: 5000
                    });
                });
            };

            var _onQueryFailed = function (error) {

                _deferred.resolve();

                toastr.error(error.message, 'Error', {
                    timeOut: 5000
                });
            };

            AppDB._cameraAppDB.transaction(function (tx) {

                tx.executeSql('SELECT * FROM Defected Where NewRecord = ?;', [1], _onQuerySuccess, _onQueryFailed);
            });

            // Return the deferred's promise.
            return _deferred.promise;
        };

        $scope.pushDefectedResultData = function () {

            // Set up the $q deferred object.
            var _deferred = $q.defer();

            var _pushDefectedUrl = WebService.getUrl() + 'PushDefectedResult';

            var _onQuerySuccess = function (tx, results) {

                var _defectedResults = [];

                for (var i = 0; i < results.rows.length; i++) {
                    _defectedResults.push(results.rows.item(i));
                }

                //alert(JSON.stringify(_defectedResults));

                var _data = {
                    _JsonData: JSON.stringify(_defectedResults)
                };

                $http.post(_pushDefectedUrl, _data).then(function (data) {

                    _deferred.resolve(data);

                    //success callback after calling webservice
                    toastr.success('Push Defected Results complete!', 'Information', {
                        timeOut: 5000
                    });

                }, function (data) {

                    _deferred.resolve();

                    //error callback after calling webservice
                    toastr.error('Post to server failed!', 'Information', {
                        timeOut: 5000
                    });
                });
            };

            var _onQueryFailed = function (error) {

                _deferred.resolve();

                toastr.error(error.message, 'Error', {
                    timeOut: 5000
                });
            };

            AppDB._cameraAppDB.transaction(function (tx) {

                tx.executeSql('SELECT * FROM DEFECTED_RESULT Where NewRecord = ?;', [1], _onQuerySuccess, _onQueryFailed);
            });

            // Return the deferred's promise.
            return _deferred.promise;
        };

        //function on sync data from service
        $scope.onSyncData = function () {

            var _success = 0;

            var _webServiceUrl = WebService.getUrl();

            //toastr.info('url : ' + _webServiceUrl, 'Network Information', {
            //    timeOut: 5000
            //});

            //check if database instance is null
            if (_.isNull(AppDB) || _.isUndefined(AppDB))
                return;

            //check if database is null
            if (_.isNull(AppDB._cameraAppDB) || _.isUndefined(AppDB._cameraAppDB))
                return;

            if (!_.isNull(_webServiceUrl) && !_.isUndefined(_webServiceUrl)) {

                //show the loading bar
                cfpLoadingBar.start();

                //start the sync task
                $q.all([
                    $scope.pushDefectedData(),
                    $scope.pushDefectedResultData()
                ]).then(function (results) {

                    //var _callBackDefected = JSON.parse(results[0].data);

                    //var _callBackDefectedResult = JSON.parse(results[1].data);
                    // call back from push Defected data and DefectedResults;


                    //if (_callBackDefected.ErrorCode === _success
                    //       && _callBackDefectedResult.ErrorCode === _success)
                    //{
                    //drop ALL TABLES 
                    AppDB.dropAllTables();

                    //create ALL TABLES
                    AppDB.createAllTables();

                    //sync data from service
                    AppDB.syncData().then(function (result) {

                        toastr.success('Webservice Called Complete!', 'Information', {
                            timeOut: 10000
                        });

                        //insert data into tables 
                        AppDB.insertData(result).then(function () {

                            cfpLoadingBar.complete();

                            toastr.success('Synced Complete!', 'Information', {
                                timeOut: 5000
                            });

                            var _loginViewPath = '/loginView';
                            //change page to login view page
                            $location.path(_loginViewPath).replace();

                        }, function (res) {

                            cfpLoadingBar.complete();

                            //drop ALL TABLES 
                            AppDB.dropSetupTable();
                            AppDB.dropAllTables();

                            toastr.error('Synced Falied at TABLE : ' + res.Table, 'Error', {
                                timeOut: 5000
                            });
                        });

                    }, function (result) {

                        cfpLoadingBar.complete();

                        //drop ALL TABLES 
                        AppDB.dropSetupTable();
                        AppDB.dropAllTables();

                        toastr.error('Could not connect to ' + result.config.url, 'Error', {
                            timeOut: 5000
                        });
                    });
                    //}
                }, function (results) {

                    cfpLoadingBar.complete();

                    toastr.error('Could not push data to server' + results.config.url, 'Error', {
                        timeOut: 5000
                    });
                });
            }
        };

        //function for edit network config
        $scope.onEditConfig = function () {

            var _setupViewPath = '/setupView';
            //change page to login view page
            $location.path(_setupViewPath).replace();
        };
    }]);