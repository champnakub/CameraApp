'use strict';

var WebService = angular.module('myApp.WSTestView', ['ngRoute']);

WebService.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/wsTestView', {
            templateUrl: 'webservice_components/ws.html',
            controller: 'WSCtrl'
        });
    }]);

WebService.controller('WSCtrl', ['$scope', 'WebService', '$http', 'cfpLoadingBar', '_', 'AppDB', 'toastr', function ($scope, webService, $http, cfpLoadingBar, _, AppDB, toastr) {

        if (!_.isNull(AppDB) && !_.isUndefined(AppDB))
            AppDB.openDataBase();

        //web service url
        //$scope.WS_URL = webService.getUrl();
        //$scope.WS_URL = 'http://beau888.dyndns.org:222/DataService/';
        $scope.WS_URL = 'http://124.122.67.197:222/DataService/';
        
        //function for calling POST method
        $scope.onPOST = function () {

            var _postUrl = $scope.WS_URL + $scope.postUrl;

            var _parameters = {name: 'Champ', surName: 'Sammanont', Age: 26};

            //call webservice
            var _response = $http.post(_postUrl, _parameters);

            //callback from web service [* success]
            _response.success(function (data, status, headers, config) {
                console.log(data);
            });

            //callback from web service [* error]
            _response.error(function (data, status, headers, config) {
                toastr.error('Could not call web service', 'Error', {
                    timeOut: 5000
                });
            });
        };

        //function for calling GET method
        $scope.onGET = function () {

            var _getUrl = $scope.WS_URL + $scope.getUrl;

            $scope._inspectorData = [];

            //call web service
            var _response = $http.get(_getUrl);

            //callback from web service [* success]
            _response.success(function (data) {
                //parse to JSON format
                var _inspectorData = JSON.parse(data);
                //fill up the data 
                $scope._inspectorData.push(_inspectorData);
            });

            //callback from web service [* error]
            _response.error(function (data, status, headers, config) {

                toastr.error('Could not call web service', 'Error', {
                    timeOut: 5000
                });
            });
        };

        //function for calling SYNC method
        $scope.onSyncData = function () {

            //check if database instance is null
            if (_.isNull(AppDB) || _.isUndefined(AppDB))
                return;

            //check if database is null
            if (_.isNull(AppDB._cameraAppDB) || _.isUndefined(AppDB._cameraAppDB))
                return;

            //drop TABLE [* PROJECT]
            AppDB.dropProjectTable();

            //create TABLE [* PROJECT]
            AppDB.createProjectTable();

            //show the loading bar
            cfpLoadingBar.start();

            //call web service
            var _syncUrl = $scope.WS_URL + 'GetProjectData';

            var _response = $http.get(_syncUrl);

            //callback from web service [* success]
            _response.success(function (data) {
                //parse to JSON format
                var _syncData = JSON.parse(data);

                //fill up the data 
                $scope._syncData = _syncData;

                //@insert operation
                //@insert on synced finished from the server
                for (var i = 0; i < _syncData.length; i++) {

                    var _syncedData = _syncData[i];

                    var Description = _.isNull(_syncedData.Description) ? "" : _syncedData.Description;

                    var Customer = _syncedData.Customer;

                    var Code = _syncedData.Code;

                    var ID = _syncedData.ID;

                    AppDB._cameraAppDB.executeSql("INSERT INTO PROJECT (Description, Customer, Code, ID) VALUES (?, ?, ?, ?)", [Description, Customer, Code, ID], function (tx, res) {
                        //insert success
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
        };

        //function for render data from TABLE [* PROJECT]
        $scope.onRenderData = function () {


            //check if database instance is null
            if (_.isNull(AppDB) || _.isUndefined(AppDB))
                return;

            //check if database is null
            if (_.isNull(AppDB._cameraAppDB) || _.isUndefined(AppDB._cameraAppDB))
                return;

            //show the loading bar
            cfpLoadingBar.start();

            var _onQuerySuccess = function (results) {

                $scope._syncData = [];

                //fill the data
                for (var i = 0; i < results.rows.length; i++) {
                    // Each row is a standard JavaScript array indexed by
                    // column names.
                    var _row = results.rows.item(i);

                    var _insertData = {
                        ID: _row.ID,
                        Code: _row.Code,
                        Customer: _row.Customer,
                        Description: _row.Description
                    };

                    $scope._syncData.push(_insertData);
                }
                ;

                //show the loading bar
                cfpLoadingBar.complete();
            };

            var _onQueryFailed = function (e) {

                toastr.error(e.message, 'Error', {
                    timeOut: 5000
                });
            };

            AppDB._cameraAppDB.executeSql('SELECT * FROM PROJECT', [], _onQuerySuccess, _onQueryFailed);
        };
    }]);