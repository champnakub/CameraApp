'use strict';

var Sync = angular.module('myApp.SyncView', []);

Sync.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/syncView', {
            templateUrl: 'sync_components/sync.html',
            controller: 'SyncCtrl'
        });
    }]);

Sync.controller('SyncCtrl', ['$scope', '$location', 'AppDB', 'WebService', '_', '$http', 'cfpLoadingBar', 'toastr', function ($scope, $location, AppDB, webService, _, $http, cfpLoadingBar, toastr) {

        //function on sync data from service
        $scope.onSyncData = function () {

            var _webServiceUrl = webService.getUrl();

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

                        toastr.error('Synced Falied at TABLE : ' + res.Table, 'Error', {
                            timeOut: 5000
                        });
                    });

                }, function (result) {
                    
                    cfpLoadingBar.complete();
                    
                    //drop ALL TABLES 
                    AppDB.dropAllTables();

                    toastr.error('Could not connect to ' + result.config.url, 'Error', {
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