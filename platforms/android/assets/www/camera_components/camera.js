'use strict';

var Camera = angular.module('myApp.CameraView', ['ngRoute']);

Camera.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/cameraView', {
            templateUrl: 'camera_components/camera.html',
            controller: 'CameraCtrl'
        });
    }]);

Camera.controller('CameraCtrl', ['$scope', function ($scope) {

        //call sql main controller
        //@insert operation
        //$scope.db.insert('user', {"username": 'pc', "password": '1234', 'age': 22}).then(function (results) {

        //});

        //@select operation
        $scope.db.selectAll("user").then(function (results) {
            $scope.users = [];
            for (var i = 0; i < results.rows.length; i++) {
                $scope.users.push(results.rows.item(i));
            }
            console.log($scope.users);
        });

        //array of images taken from CAMERA or GALLERY
        $scope.Images = [];

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
                    $scope.Images.push(pic);
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
                    $scope.Images.push(pic);
                });
            };
            var failure = function (message) {
                alert('Failed because: ' + message);
            };
            //call the cordova camera plugin to open the device's gallery
            navigator.camera.getPicture(success, failure, cameraOptions);
        };
    }]);