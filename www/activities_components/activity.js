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

        document.addEventListener('backbutton', function (e) {

            var _modal = angular.element('#defected-info-dialog');

            if (_modal.is(':visible'))
            {
                e.preventDefault();
            } else
            {
                var _projectViewPath = '/projectView';
                //change page to project view page
                $scope.$apply(function () {
                    $location.path(_projectViewPath).replace();
                });
            }

        }, false);

        var _currentDefectedStatus = null;

        var _selectedStatus = null;

        $scope.projectData = Project.getProjectData();

        $scope.inspectorName = User.getFullName();

        $scope.image = "images/blank.png";

        $scope.searhDefectedResult = '';

        $scope._defectedBuildings = [];

        $scope._defectedLevels = [];

        $scope._defectedRooms = [];

        $scope._defectedAreas = [];

        $scope._defectedResults = [];

        $scope._defectedResultLevels = [];

        $scope._defectedResultRooms = [];

        $scope._contractors = [];

        $scope._status = [];

        $scope._statusColor = [{color: '#ebccd1'}, {color: 'rgb(250, 255, 140)'}, {color: '#dff0d8'}];

        $scope._isPictureTaken = false;

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

                    $scope._isPictureTaken = true;

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

                    $scope._isPictureTaken = true;

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

                tx.executeSql('SELECT ID, Description FROM Level Where Building = ? Order By Code;', [$scope.defectedBuildingSelected.ID], _onQuerySuccess, _onQueryFailed);
            });
        };

        //@Event on choosing defected level
        $scope.onDefectedLevel = function () {

            AppDB._cameraAppDB.transaction(function (tx) {

                var _onQuerySuccess = function (tx, results) {

                    $scope._defectedRooms = [];

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

                tx.executeSql('SELECT ID, Description FROM Level Where Building = ? Order By Code;', [$scope.defectedResultBuildingSelected.ID], _onQuerySuccess, _onQueryFailed);
            });
        };

        //@Event on choosing defected result level
        $scope.onDefectedResultLevel = function () {

            AppDB._cameraAppDB.transaction(function (tx) {

                var _onQuerySuccess = function (tx, results) {

                    $scope._defectedResultRooms = [];

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
                    || _.isNull($scope.defectedComment) || _.isUndefined($scope.defectedComment) || $scope._isPictureTaken === false) {

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

                            $scope._isPictureTaken = false;

                            $scope.image = "images/blank.png";

                            $scope.defectedComment = null;
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
                        0, // 0 not cleared, 1 as designed, 2 cleared
                        0,
                        $scope.defectedComment,
                        1
                    ];

                    tx.executeSql(_query, _queryValues, _onQuerySuccess, _onQueryFailed);
                });
            }
        };

        //@Event on save in popup
        $scope.onModalSave = function () {

            if (!_.isNull(_currentDefectedStatus) && !_.isUndefined(_currentDefectedStatus))
            {
                //check if the defected status has changed or not
                if (!_.isNull(_selectedStatus) && !_.isUndefined(_selectedStatus))
                {
                    if (_currentDefectedStatus !== _selectedStatus)
                    {
                        //update
                        AppDB._cameraAppDB.transaction(function (tx) {

                            var _onQuerySuccess = function (tx, results) {

                                //insert
                                AppDB._cameraAppDB.transaction(function (tx) {

                                    var _onInsertSuccess = function (tx, results) {

                                        $scope.$apply(function () {
                                            // perform any model changes or method invocations here on angular app.
                                            $scope.getDefectedResults();
                                        });

                                        toastr.success('Saved complete!', 'Information', {
                                            timeOut: 5000
                                        });

                                        $("[data-dismiss=modal]").trigger({type: "click"});
                                    };

                                    var _onInsertFailed = function (error) {

                                        toastr.error('Could not save!', 'Error', {
                                            timeOut: 5000
                                        });

                                        return;
                                    };

                                    var _now = new Date().getTime();

                                    var _query = 'INSERT INTO DEFECTED_RESULT (Defected, ResultedBy, ResultDate, Result, Imei, Comment, NewRecord) VALUES (?, ?, ?, ?, ?, ? ,?);';

                                    var _queryValues = [
                                        $scope._currentGridDefectedItem.DF_ID, //defected
                                        User.getID(), // resulted bym,
                                        _now, //result date
                                        _selectedStatus, //status
                                        window.device.uuid, // Imei,
                                        $scope.remark, //comment
                                        1 // new record
                                    ];

                                    tx.executeSql(_query, [_queryValues], _onInsertSuccess, _onInsertFailed);
                                });
                            };

                            var _onQueryFailed = function (error) {

                                toastr.error(error.message, 'Error', {
                                    timeOut: 5000
                                });

                                return;
                            };

                            var _query = 'UPDATE DEFECTED SET Status = ? Where DF_ID = ?;';

                            tx.executeSql(_query, [_selectedStatus, $scope._currentGridDefectedItem.DF_ID], _onQuerySuccess, _onQueryFailed);
                        });
                    } else
                        $("[data-dismiss=modal]").trigger({type: "click"});
                } else
                    $("[data-dismiss=modal]").trigger({type: "click"});
            }
        };

        //@Event on get defected results to show in grid
        $scope.getDefectedResults = function () {

            var _query = "SELECT BasedArea.Description, Defected.DF_ID, Defected.Status, Defected.DefectedImage, Defected.NewRecord, Defected.Code, Building.Code as [Building], Level.Code as [Level], Room.Code as [Room], Defected.DateCreated , Defected.Comment , Contractor.FullName FROM Defected Inner join Contractor On Lower(Defected.Contractor) = Contractor.ID Inner Join Inspector On Lower(Defected.Inspector) = Inspector.ID Inner Join BasedArea On Lower(Defected.Area) = BasedArea.ID Inner Join Building On Lower(Defected.Building) = Building.ID Inner Join Level On Lower(Defected.Level) = Level.ID Inner Join Room On Lower(Defected.Room) = Room.ID Where Room.ID = ? ORDER BY DF_ID DESC;";

            AppDB._cameraAppDB.transaction(function (tx) {

                var _onQuerySuccess = function (tx, results) {

                    $scope._defectedResults = [];

                    var _defectedResults = results;

                    for (var i = 0; i < _defectedResults.rows.length; i++) {

                        var _date = new Date(parseFloat(_defectedResults.rows.item(i).DateCreated));

                        _defectedResults.rows.item(i).DateCreatedString = _date.toDateString() + " [" + _date.toLocaleTimeString() + "]";

                        $scope.$apply(function () {
                            $scope._defectedResults.push(_defectedResults.rows.item(i));
                        });
                    }
                    ;
                };

                var _onQueryFailed = function (error) {

                    toastr.error(error.message, 'Error', {
                        timeOut: 5000
                    });
                };

                tx.executeSql(_query, [$scope.defectedResultRoomSelected.ID], _onQuerySuccess, _onQueryFailed);
            });
        };

        //@Event on grid item click
        $scope.onGridItem = function (_defectedItem) {

            $scope.remark = '';

            getStatusData();

            $scope._currentGridDefectedItem = _defectedItem;

            $scope.statusSelected = $scope._status[parseInt($scope._currentGridDefectedItem.Status)];

            $scope.onStatus($scope.statusSelected);

            _currentDefectedStatus = $scope._currentGridDefectedItem.Status;
        };

        //@Event on choosing status
        $scope.onStatus = function (_status) {

            var _color = $scope._statusColor[_status.ID].color;

            _selectedStatus = _status.ID;

            angular.element('.status').css({
                'background-image': 'linear-gradient(' + _color + ',' + _color + '),linear-gradient(#D2D2D2,#D2D2D2)'
            });
        };

        //@Event on delete defected item [Where NewRecord = 1]
        $scope.onDelete = function (_defectedItem) {

            //@Event get Status data on start up
            AppDB._cameraAppDB.transaction(function (tx) {

                var _onQuerySuccess = function (tx, results) {

                    $scope.$apply(function () {

                        $scope.getDefectedResults();
                    });

                    toastr.success('Delete complete!', 'Information', {
                        timeOut: 5000
                    });
                };
                var _onQueryFailed = function (error) {

                    toastr.error('Error : TABLE DEFECTED', 'Error', {
                        timeOut: 5000
                    });
                };

                tx.executeSql('DELETE FROM DEFECTED WHERE DF_ID = ?;', [_defectedItem.DF_ID], _onQuerySuccess, _onQueryFailed);
            });
        };

        //@Event om get status data
        var getStatusData = function () {

            //@Event get Status data on start up
            AppDB._cameraAppDB.transaction(function (tx) {

                var _onQuerySuccess = function (tx, results) {

                    $scope._status = [];

                    var _statusDatas = results;

                    for (var i = 0; i < _statusDatas.rows.length; i++) {

                        $scope.$apply(function () {
                            $scope._status.push(_statusDatas.rows.item(i));
                        });
                    }
                    ;
                };

                var _onQueryFailed = function (error) {

                    toastr.error(error.message, 'Error', {
                        timeOut: 5000
                    });
                };

                tx.executeSql('SELECT * FROM STATUS', [], _onQuerySuccess, _onQueryFailed);
            });
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

        getStatusData();
    }]);
