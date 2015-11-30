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
        $scope.onPOST = function () {

            var _postUrl = $scope.WS_URL + $scope.postUrl;

            var _parameters = {name: 'Champ', surName: 'Sammanont', Age: 26};

            //call webservice
            var res = $http.post(_postUrl, _parameters);

            //callback from web service [* success]
            res.success(function (data, status, headers, config) {
                console.log(data);
            });

            //callback from web service [* error]
            res.error(function (data, status, headers, config) {
                alert("failure message: " + JSON.stringify({data: data}));
            });
        };

        //function for calling GET method
        $scope.onGET = function () {

            var _getUrl = $scope.WS_URL + $scope.getUrl;

            $scope._inspectorData = [];

            //call web service
            var res = $http.get(_getUrl);

            //callback from web service [* success]
            res.success(function (data) {
                //parse to JSON format
                var _inspectorData = JSON.parse(data);
                //fill up the data 
                $scope._inspectorData.push(_inspectorData);
            });

            //callback from web service [* error]
            res.error(function (data, status, headers, config) {
                alert("failure message: " + JSON.stringify({data: data}));
            });
        };
    }]);