'use strict';

//git repository
//https://github.com/champnakub/CameraApp.git

// Declare app level module which depends on views, and components
var App = angular.module('myApp', [
    'ngRoute',
    
    'myApp.version', 
    'myApp.LoginView',
    'myApp.CameraView',
    'myApp.ItemView',
   
    'angular-carousel',
    'angular-websql',
    
    'cfp.loadingBar'
]);

//contstant
App.constant('_',
    window._
);

App.controller('MainController', ['$scope', '$webSql', function ($scope, $webSql) {

        console.log('-----------------------APP INSTANTIATED-----------------------');

        //instantiate web database
        $scope.db = $webSql.openDatabase('CameraApp', '1.0', 'CameraApp DB', 2 * 1024 * 1024);
        
        //delete table
        //$scope.db.del("user");  
        
        //create the web database
        //@param1 = Database Name
        //@param2 = Version Number
        //@param3 = Text Description
        //@param4 = Size of Database
        $scope.db.createTable('user', {
            "id": {
                "type": "INTEGER",
                "null": "NOT NULL", // default is "NULL" (if not defined)
                "primary": true, // primary
                "auto_increment": true // auto increment
            },
            "created": {
                "type": "TIMESTAMP",
                "null": "NOT NULL",
                "default": "CURRENT_TIMESTAMP" // default value
            },
            "username": {
                "type": "TEXT",
                "null": "NOT NULL"
            },
            "password": {
                "type": "TEXT",
                "null": "NOT NULL"
            },
            "age": {
                "type": "INTEGER"
            }
        });
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
                        
                otherwise({redirectTo: '/itemView'});
    }]);

