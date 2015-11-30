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
    'angular-carousel',
    'angular-websql',
    'cfp.loadingBar'
]);

//constant for underscore.js
App.factory('_', ['$window', function($window) {
  return $window._; // assumes underscore has already been loaded on the page
}]);

//constant for webservice
App.constant('WebService', {
   url : 'http://beau888.dyndns.org:222/DataService/' 
});

//controller
App.controller('MainController', ['$scope', '$webSql', function ($scope, $webSql) {
        
        
        console.log('-----------------------WELCOME TO CHAMP WORLD-----------------------');
        console.log('-----------------------APP INSTANTIATED-----------------------');

        //instantiate web database
        //@param1 = Database Name
        //@param2 = Version Number
        //@param3 = Text Description
        //@param4 = Size of Database
        $scope.db = $webSql.openDatabase('CameraApp', '1.0', 'CameraApp DB', 2 * 1024 * 1024);
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

