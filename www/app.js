'use strict';

//git repository
//https://github.com/champnakub/CameraApp.git

// Declare app level module which depends on views, and components
var App = angular.module('myApp', [
    'ngRoute',
    'myApp.version',
    //VIEW SECTION
    'myApp.ItemView',
    'myApp.LoginView',
    'myApp.CameraView',
    'myApp.WSTestView',
    //ANGULAR LIBRARY SECTION
    'cfp.loadingBar',
    'angular-websql',
    'angular-carousel'
]);

//constant for underscore.js
App.factory('_', ['$window', function ($window) {
        return $window._; // assumes underscore has already been loaded on the page
    }]);

//constant for webservice
App.constant('WebService', {
    url: 'http://beau888.dyndns.org:222/DataService/'
});

//constant for database
App.factory('AppDB', function () {

    var _self = this;
    
    //open database
    _self.openDataBase = function () {
        // Cordova is ready
        var onDeviceReady = function () {

            var _onCreateDBSuccess = function () {};

            var _onCreateDBFailed = function (err) {
                alert('Open database ERROR: ' + JSON.stringify(err));
            };

            _self._cameraAppDB = window.sqlitePlugin.openDatabase({name: "CameraApp"}, _onCreateDBSuccess, _onCreateDBFailed);
        };

        // Wait for Cordova to load
        document.addEventListener("deviceready", onDeviceReady, false);
    };
    
    //property of TABLE [* PROJECT]
    //@CREATE
    _self.createProjectTable = function () {
        
        _self._cameraAppDB.executeSql('CREATE TABLE IF NOT EXISTS PROJECT (PROJECT_ID integer primary key, ID text, Customer text, Code text, Description text)');
    };
    
    //property of TABLE [* PROJECT]
    //@DROP
     _self.dropProjectTable = function () {
        
        _self._cameraAppDB.executeSql('DROP TABLE IF EXISTS PROJECT');
    };
    
    return _self;
});

//controller
App.controller('MainController', ['$scope', '$webSql', function ($scope, $webSql) {

        console.log('-----------------------APP INSTANTIATED-----------------------');
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
                when('/itemView', {
                    templateUrl: 'item_components/item.html',
                    controller: 'ItemCtrl'
                }).
                when('/wsTestView', {
                    templateUrl: 'webservice_components/ws.html',
                    controller: 'WSCtrl'
                }).
                otherwise({redirectTo: '/wsTestView'});
    }]);

