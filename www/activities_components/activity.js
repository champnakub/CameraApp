'use strict';

var Activity = angular.module('myApp.ActivityView', ['ngRoute']);

Activity.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/activityView', {
            templateUrl: 'activities/activity.html',
            controller: 'ActivityCtrl'
        });
    }]);

Activity.directive('showtab', function () {
    return {
        link: function (scope, element, attrs) {
            element.click(function (e) {
                e.preventDefault();
                $(element).tab('show');
            });
        }
    };
});

Activity.controller('ActivityCtrl', ['$scope', '$location', 'AppDB', 'toastr', 'Project', 'User', function ($scope, $location, AppDB, toastr, Project, User) {

        //@ selected defected building
        var _selectedDFBL = null;

        //@ selected defected level
        var _selectedDFLV = null;

        //@ selected defected room
        var _selectedDFRM = null;

        //@ selected defected based area
        var _selectedDFAR = null;

        //@ selected contractor
        var _selectedContractor = null;
        
        $scope.projectData = Project.getProjectData();
        
        $scope.inspectorName = User.getFullName();
        
        $scope.image = "images/blank.png";
        
        $scope._defectedBuildings = [];

        $scope._defectedLevels = [];

        $scope._defectedRooms = [];

        $scope._defectedArea = [];

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

            _selectedDFBL = defectedBuilding;

            AppDB._cameraAppDB.transaction(function (tx) {

                var _onQuerySuccess = function (tx, results) {

                    $scope._defectedLevels = [];

                    $scope._defectedRooms = [];

                    $scope._defectedArea = [];

                    _selectedDFLV = null;

                    _selectedDFRM = null;

                    _selectedDFAR = null;

                    var _levelDatas = results;

                    for (var i = 0; i < _levelDatas.rows.length; i++) {

                        $scope.$apply(function () {
                            $scope._defectedLevels.push(_levelDatas.rows.item(i));
                        });
                    }
                    ;
                };

                var _onQueryFailed = function (error) {

                    toastr.error(error.message, 'Error', {
                        timeOut: 5000
                    });
                };

                tx.executeSql('SELECT ID, Description FROM Level Where Building = ?;', [defectedBuilding.ID], _onQuerySuccess, _onQueryFailed);
            });
        };

        //@Event on choosing defected level
        $scope.onDefectedLevel = function (defectedLevel) {

            _selectedDFLV = defectedLevel;

            AppDB._cameraAppDB.transaction(function (tx) {

                var _onQuerySuccess = function (tx, results) {

                    var _roomDatas = results;

                    for (var i = 0; i < _roomDatas.rows.length; i++) {

                        $scope.$apply(function () {
                            $scope._defectedRooms.push(_roomDatas.rows.item(i));
                        });
                    }
                    ;
                };

                var _onQueryFailed = function (error) {

                    toastr.error(error.message, 'Error', {
                        timeOut: 5000
                    });
                };

                tx.executeSql('SELECT ID, Description FROM ROOM Where Level = ?;', [defectedLevel.ID], _onQuerySuccess, _onQueryFailed);
            });
        };

        //@Event on choosing defected level
        $scope.onDefectedRoom = function (defectedRoom) {

            _selectedDFRM = defectedRoom;
        };

        //@Event get Building data on start up
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

            tx.executeSql('SELECT ID, Description FROM BUILDING Where Project = ?;', [$scope.projectData.ID], _onQuerySuccess, _onQueryFailed);
        });
    }]);