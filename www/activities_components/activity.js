'use strict';

var Activity = angular.module('myApp.ActivityView', ['ngRoute']);

Activity.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/activityView', {
            templateUrl: 'activities/activity.html',
            controller: 'ActivityCtrl'
        });
    }]);

Activity.controller('ActivityCtrl', ['$scope', '$location', 'AppDB', 'toastr', function ($scope, $location, AppDB, toastr) {

        $scope._defectedBuildings = [];

        $scope.image = "images/blank.png";

        //@Back to PROJECT view
        $scope.back = function () {

            var _projectViewPath = '/projectView';
            //change page to project view page
            $location.path(_projectViewPath);
        };

        //@ Take Picture
        $scope.takePicture = function () {
            var cameraOptions = {
                quality: 20,
                correctOrientation: true,
                destinationType: Camera.DestinationType.DATA_URL
            };
            var success = function (data) {
                $scope.$apply(function () {
                    var pic = "data:image/jpeg;base64," + data;
                    $scope.image = pic;
                });
            };
            var failure = function (message) {
                alert('Failed because: ' + message);
            };
            //call the cordova camera plugin to open the device's camera
            navigator.camera.getPicture(success, failure, cameraOptions);
        };

        //@ Get Picture
        $scope.getPicture = function () {
            var cameraOptions = {
                quality: 20,
                correctOrientation: true,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM
            };
            var success = function (data) {
                $scope.$apply(function () {
                    var pic = "data:image/jpeg;base64," + data;
                    $scope.image = pic;
                });
            };
            var failure = function (message) {
                alert('Failed because: ' + message);
            };
            //call the cordova camera plugin to open the device's gallery
            navigator.camera.getPicture(success, failure, cameraOptions);
        };

        //@ Event on choosing defected builing
        $scope.onDefectedBuilding = function (defectedBuilding) {
            
            alert(JSON.stringify(defectedBuilding));
        };

        AppDB._cameraAppDB.transaction(function (tx) {

            var _onQuerySuccess = function (tx, results) {

                var _buildingDatas = results;

                for (var i = 0; i < _buildingDatas.rows.length; i++) {

                    $scope.$apply(function () {
                        $scope._defectedBuildings.push(_buildingDatas.rows.item(i));
                    });
                }
                ;
            };

            var _onQueryFailed = function (error) {

                toastr.error(error.message, 'Error', {
                    timeOut: 5000
                });
            };

            tx.executeSql('SELECT * FROM BUILDING', [], _onQuerySuccess, _onQueryFailed);
        });
    }]);

Activity.directive('showtab',
        function () {
            return {
                link: function (scope, element, attrs) {
                    element.click(function (e) {
                        e.preventDefault();
                        $(element).tab('show');
                    });
                }
            };
        });