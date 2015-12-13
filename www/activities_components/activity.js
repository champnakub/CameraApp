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

Activity.controller('ActivityCtrl', ['$scope', '$location', 'AppDB', 'toastr', 'Project', 'User', '$route', '_', function ($scope, $location, AppDB, toastr, Project, User, $route, _) {

        $scope.sortType = 'name'; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.searchFish = '';     // set the default search/filter term

        // create the list of sushi rolls 
        $scope.sushi = [
            {name: 'Cali Roll', fish: 'Crab', tastiness: 2},
            {name: 'Philly', fish: 'Tuna', tastiness: 4},
            {name: 'Tiger', fish: 'Eel', tastiness: 7},
            {name: 'Rainbow', fish: 'Variety', tastiness: 6},
            {name: 'Cali Roll', fish: 'Crab', tastiness: 2},
            {name: 'Philly', fish: 'Tuna', tastiness: 4},
            {name: 'Tiger', fish: 'Eel', tastiness: 7},
            {name: 'Rainbow', fish: 'Variety', tastiness: 6},
            {name: 'Cali Roll', fish: 'Crab', tastiness: 2},
            {name: 'Philly', fish: 'Tuna', tastiness: 4},
            {name: 'Tiger', fish: 'Eel', tastiness: 7},
            {name: 'Rainbow', fish: 'Variety', tastiness: 6}
        ];

        $scope.projectData = Project.getProjectData();

        $scope.inspectorName = User.getFullName();

        $scope.image = "images/blank.png";

        $scope._defectedBuildings = [];

        $scope._defectedLevels = [];

        $scope._defectedRooms = [];

        $scope._defectedAreas = [];

        $scope._defectedResultLevels = [];

        $scope._defectedResultRooms = [];

        $scope._contractors = [];

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
        $scope.onDefectedBuilding = function () {

            AppDB._cameraAppDB.transaction(function (tx) {

                var _onQuerySuccess = function (tx, results) {

                    $scope._defectedLevels = [];

                    $scope._defectedRooms = [];

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

                tx.executeSql('SELECT ID, Description FROM Level Where Building = ?;', [$scope.defectedBuildingSelected.ID], _onQuerySuccess, _onQueryFailed);
            });
        };

        //@Event on choosing defected level
        $scope.onDefectedLevel = function () {

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

                tx.executeSql('SELECT ID, Description FROM ROOM Where Level = ?;', [$scope.defectedLevelSelected.ID], _onQuerySuccess, _onQueryFailed);
            });
        };

        //@Event on choosing defected level
        $scope.onDefectedRoom = function () {
        };

        //@Event on choosing defected area
        $scope.onDefectedArea = function () {
        };

        //@Event on choosing defected result building
        $scope.onDefectedResultBuilding = function () {

            AppDB._cameraAppDB.transaction(function (tx) {

                var _onQuerySuccess = function (tx, results) {

                    $scope._defectedResultLevels = [];

                    $scope._defectedResultRooms = [];

                    var _levelDatas = results;

                    for (var i = 0; i < _levelDatas.rows.length; i++) {

                        $scope.$apply(function () {
                            $scope._defectedResultLevels.push(_levelDatas.rows.item(i));
                        });
                    }
                    ;
                };

                var _onQueryFailed = function (error) {

                    toastr.error(error.message, 'Error', {
                        timeOut: 5000
                    });
                };

                tx.executeSql('SELECT ID, Description FROM Level Where Building = ?;', [$scope.defectedResultBuildingSelected.ID], _onQuerySuccess, _onQueryFailed);
            });
        };

        //@Event on choosing defected result level
        $scope.onDefectedResultLevel = function () {

            AppDB._cameraAppDB.transaction(function (tx) {

                var _onQuerySuccess = function (tx, results) {

                    var _roomDatas = results;

                    for (var i = 0; i < _roomDatas.rows.length; i++) {

                        $scope.$apply(function () {
                            $scope._defectedResultRooms.push(_roomDatas.rows.item(i));
                        });
                    }
                    ;
                };

                var _onQueryFailed = function (error) {

                    toastr.error(error.message, 'Error', {
                        timeOut: 5000
                    });
                };

                tx.executeSql('SELECT ID, Description FROM ROOM Where Level = ?;', [$scope.defectedResultLevelSelected.ID], _onQuerySuccess, _onQueryFailed);
            });
        };

        //@Event on choosing defected room level
        $scope.onDefectedResultRoom = function () {

        };

        //@Event on clear page data
        $scope.clearData = function () {

            $route.reload();

            toastr.info('Data cleared!', 'Information', {
                timeOut: 5000
            });
        };

        //@Event on save page data [defected]
        $scope.onSave = function () {

            if (_.isNull($scope.defectedBuildingSelected) || _.isUndefined($scope.defectedBuildingSelected)
                    || _.isNull($scope.defectedLevelSelected) || _.isUndefined($scope.defectedLevelSelected)
                    || _.isNull($scope.defectedRoomSelected) || _.isUndefined($scope.defectedRoomSelected)
                    || _.isNull($scope.defectedAreaSelected) || _.isUndefined($scope.defectedAreaSelected)
                    || _.isNull($scope.contractorSelected) || _.isUndefined($scope.contractorSelected)
                    || _.isNull($scope.defectedComment) || _.isUndefined($scope.defectedComment)) {

                toastr.warning('Please complete all the fields.', 'Warning', {
                    timeOut: 5000
                });
            } else {
                AppDB._cameraAppDB.transaction(function (tx) {

                    var _onQuerySuccess = function (tx, results) {

                        toastr.success('Saved Complete.', 'Information', {
                            timeOut: 5000
                        });

                        $scope.$apply(function () {
                            $scope.clearData();
                        });
                    };

                    var _onQueryFailed = function (error) {

                        toastr.error(error.message, 'Error', {
                            timeOut: 5000
                        });
                    };

                    var _query = 'INSERT INTO DEFECTED (ID, Code, DateCreated, Project, Building, Level, Room, Area, Inspector, Contractor, Imei, DefectedImage, Status, Closed, Comment, NewRecord) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

                    var _dateCreated = new Date();

                    var _queryValues = [
                        null,
                        null,
                        _dateCreated.getTime(),
                        $scope.projectData.ID,
                        $scope.defectedBuildingSelected.ID,
                        $scope.defectedLevelSelected.ID,
                        $scope.defectedRoomSelected.ID,
                        $scope.defectedAreaSelected.ID,
                        User.getID(),
                        $scope.contractorSelected.ID,
                        window.device.uuid,
                        $scope.image,
                        0,
                        0,
                        $scope.defectedComment,
                        1
                    ];

                    tx.executeSql(_query, _queryValues, _onQuerySuccess, _onQueryFailed);
                });
            }
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

        //@Event get Location data on start up
        AppDB._cameraAppDB.transaction(function (tx) {

            var _onQuerySuccess = function (tx, results) {

                var _basedAreaDatas = results;

                for (var i = 0; i < _basedAreaDatas.rows.length; i++) {

                    $scope.$apply(function () {
                        $scope._defectedAreas.push(_basedAreaDatas.rows.item(i));
                    });
                }
                ;
            };

            var _onQueryFailed = function (error) {

                toastr.error(error.message, 'Error', {
                    timeOut: 5000
                });
            };

            tx.executeSql('SELECT ID, Description FROM BASEDAREA', [], _onQuerySuccess, _onQueryFailed);
        });

        //@Event get Contractor data on start up
        AppDB._cameraAppDB.transaction(function (tx) {

            var _onQuerySuccess = function (tx, results) {

                var _contractorDatas = results;

                for (var i = 0; i < _contractorDatas.rows.length; i++) {

                    $scope.$apply(function () {
                        $scope._contractors.push(_contractorDatas.rows.item(i));
                    });
                }
                ;
            };

            var _onQueryFailed = function (error) {

                toastr.error(error.message, 'Error', {
                    timeOut: 5000
                });
            };

            tx.executeSql('SELECT ID, FullName FROM CONTRACTOR', [], _onQuerySuccess, _onQueryFailed);
        });
    }]);
