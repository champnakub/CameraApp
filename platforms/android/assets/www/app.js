'use strict';

//git repository
//https://github.com/champnakub/CameraApp.git

// Declare app level module which depends on views, and components
var App = angular.module('myApp', [
    'ngRoute',
    'myApp.version',
    //VIEW SECTION
    'myApp.SyncView',
    'myApp.ItemView',
    'myApp.SetupView',
    'myApp.LoginView',
    'myApp.CameraView',
    'myApp.WSTestView',
    //ANGULAR LIBRARY SECTION
    'toastr',
    'cfp.loadingBar',
    'angular-websql',
    'angular-carousel'
]);

//constant for underscore.js
App.factory('_', ['$window', function ($window) {
        return $window._; // assumes underscore has already been loaded on the page
    }]);

//constant for webservice
App.factory('WebService', ['_', function (_) {

        //test url
        //'http://beau888.dyndns.org:222/DataService/'

        var _self = this;

        _self.url = null;
        
        //service port
        _self.port = 222;
        
        //service name
        _self.name = 'DataService';

        //function setUrl
        _self.setUrl = function (url) {

            _self.url = url+':'+_self.port+'/'+_self.name+'/';
        };

        //function getUrl
        _self.getUrl = function () {

            if (!_.isNull(_self.url) && !_.isUndefined(_self.url))
                return _self.url;
        };

        return _self;
    }]);

//constant for database
App.factory('AppDB', ['_', 'toastr', function (_, toastr) {

        var _self = this;

        //open database
        _self.openDataBase = function (callBack) {
            // Cordova is ready
            var onDeviceReady = function () {

                var _onCreateDBSuccess = function () {

                    if (_.isFunction(callBack))
                        callBack();
                };

                var _onCreateDBFailed = function (err) {

                    toastr.error(err.message, 'Error', {
                        timeOut: 5000
                    });
                };

                _self._cameraAppDB = window.sqlitePlugin.openDatabase({name: "CameraApp"}, _onCreateDBSuccess, _onCreateDBFailed);
            };

            // Wait for Cordova to load
            document.addEventListener("deviceready", onDeviceReady, false);
        };

        //propert of TABLE [* SETUP]
        //@CREATE
        _self.createSetupTable = function () {

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB))
                _self._cameraAppDB.executeSql('CREATE TABLE IF NOT EXISTS SETUP (SETUP_ID integer primary key, NetworkAddr text, LastSync text)');
        };

        //propert of TABLE [* SETUP]
        //@DROP
        _self.dropSetupTable = function () {

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB))
                _self._cameraAppDB.executeSql('DROP TABLE IF EXISTS SETUP');
        };

        //property of TABLE [* INSPECTOR]
        //@CREATE
        _self.createInspectorTable = function () {

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB))
                _self._cameraAppDB.executeSql('CREATE TABLE IF NOT EXISTS INSPECTOR (INSPECTOR_ID integer primary key, ID text, Code text, FullName text, UserName text, Password text)');
        };

        //property of TABLE [* INSPECTOR]
        //@DROP
        _self.dropInspectorTable = function () {

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB))
                _self._cameraAppDB.executeSql('DROP TABLE IF EXISTS INSPECTOR');
        };

        //property of TABLE [* PROJECT]
        //@CREATE
        _self.createProjectTable = function () {

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB))
                _self._cameraAppDB.executeSql('CREATE TABLE IF NOT EXISTS PROJECT (PROJECT_ID integer primary key, ID text, Customer text, Code text, Description text)');
        };

        //property of TABLE [* PROJECT]
        //@DROP
        _self.dropProjectTable = function () {

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB))
                _self._cameraAppDB.executeSql('DROP TABLE IF EXISTS PROJECT');
        };

        return _self;
    }]);

//controller
App.controller('MainController', ['$scope', 'WebService', 'AppDB', '_', '$location', 'toastr', function ($scope, webService, AppDB, _, $location, toastr) {

        console.log('[DEV] : App Instantiated');

        var openDBSucceed = function () {
            //create tables on initialized
            if (!_.isNull(AppDB) && !_.isUndefined(AppDB))
            {
                //create TABLE [* INSPECTOR]
                AppDB.createInspectorTable();

                //create TABLE [* PROJECT]
                AppDB.createProjectTable();

                //create TABLE [* SETUP]
                AppDB.createSetupTable();
            }

            if (!_.isNull(AppDB._cameraAppDB) && !_.isUndefined(AppDB._cameraAppDB))
            {
                //check if has inspector data

                var _onSetupSuccess = function (results) {

                    if (results.rows.length === 0) {

                        toastr.warning('System does not detect Network config!', 'Warning', {
                            timeOut: 5000
                        });

                        var _setupViewPath = '/setupView';

                        $scope.$apply(function () {
                            $location.path(_setupViewPath).replace();
                        });
                    } else {

                        var _setupData = results.rows.item(0);

                        var _syncViewPath = '/syncView';

                        webService.setUrl(_setupData.NetworkAddr);

                        $scope.$apply(function () {
                            $location.path(_syncViewPath).replace();
                        });
                    }
                };

                var _onSetupFailed = function (e) {

                    toastr.error(e.message, 'Error', {
                        timeOut: 5000
                    });
                };

                var _onInspectorSuccess = function (results) {

                    if (results.rows.length > 0) {

                        toastr.success('Inspector data detected', 'Information', {
                            timeOut: 5000
                        });

                        var _loginViewPath = '/loginView';
                        //change page to login view page
                        $location.path(_loginViewPath).replace();
                    } else {

                        AppDB._cameraAppDB.executeSql('SELECT * FROM SETUP', [], _onSetupSuccess, _onSetupFailed);
                    }
                };

                var _onInspectorFailed = function (e) {

                    toastr.error(e.message, 'Error', {
                        timeOut: 5000
                    });
                };

                AppDB._cameraAppDB.executeSql('SELECT * FROM INSPECTOR', [], _onInspectorSuccess, _onInspectorFailed);
            }
        };

        //function open database on initialized
        if (!_.isNull(AppDB) && !_.isUndefined(AppDB)) {

            toastr.success('Database Initialized!', 'Information', {
                timeOut: 5000
            });

            AppDB.openDataBase(openDBSucceed);
        }
    }]);

//routing modules
App.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
                when('/cameraView', {
                    templateUrl: 'camera_components/camera.html',
                    controller: 'CameraCtrl'
                }).
                when('/loginView', {
                    templateUrl: 'login_components/login.html',
                    controller: 'LoginCtrl'
                }).
                when('/syncView', {
                    templateUrl: 'sync_components/sync.html',
                    controller: 'SyncCtrl'
                }).
                when('/itemView', {
                    templateUrl: 'item_components/item.html',
                    controller: 'ItemCtrl'
                }).
                when('/wsTestView', {
                    templateUrl: 'webservice_components/ws.html',
                    controller: 'WSCtrl'
                }).
                when('/setupView', {
                    templateUrl: 'setup_components/setup.html',
                    controller: 'SetupCtrl'
                });
        //otherwise({redirectTo: '/syncView'});
    }]);

