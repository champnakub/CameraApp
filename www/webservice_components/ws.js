'use strict';

var WebService = angular.module('myApp.WSTestView', ['ngRoute']);

WebService.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/wsTestView', {
            templateUrl: 'webservice_components/ws.html',
            controller: 'WSCtrl'
        });
    }]);

WebService.controller('WSCtrl', ['$scope', 'WebService', '$http', function ($scope, webService, $http) {
        
       $scope.WS_URL = webService.url; 
        
       //function for calling POST method
       $scope.onPOST = function() {
           
       };
       
       //function for calling GET method
       $scope.onGET = function() {
           
            var _getUrl = $scope.WS_URL + $scope.getUrl;
           
            $http.get(_getUrl)
            .success(function(data) {
                console.log(data);
            });
       };
    }]);