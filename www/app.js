'use strict';

//git repository
//https://github.com/champnakub/CameraApp.git

// Declare app level module which depends on views, and components
var App = angular.module('myApp', [
    'ngRoute',
    'myApp.version',
    //VIEW SECTION
    'myApp.SyncView',
    'myApp.ItemView',
    'myApp.SetupView',
    'myApp.LoginView',
    'myApp.CameraView',
    'myApp.WSTestView',
    'myApp.ProjectView',
    'myApp.ActivityView',
    //ANGULAR LIBRARY SECTION
    'toastr',
    'ngTouch',
    'cfp.loadingBar',
    'angular-websql'
    //'angular-carousel'
]);

//constant for underscore.js
App.factory('_', ['$window', function ($window) {
        return $window._; // assumes underscore has already been loaded on the page
    }]);

//constant for user
App.factory('User', ['_', function (_) {

        var _self = this;

        _self.FullName = null;

        _self.ID = null;

        _self.getFullName = function () {

            return _self.FullName;
        };

        _self.getID = function () {

            return _self.ID;
        };

        _self.setFullName = function (fullName) {

            _self.FullName = fullName;
        };

        _self.setID = function (id) {

            _self.ID = id;
        };

        return _self; // assumes underscore has already been loaded on the page
    }]);

//constant for project
App.factory('Project', ['_', function (_) {

        var _self = this;

        _self._projectData = null;

        _self.setProjectData = function (projectData) {

            _self._projectData = projectData;
        };

        _self.getProjectData = function() {
            
            return _self._projectData;
        };

        return _self; // assumes underscore has already been loaded on the page
    }]);


//constant for webservice
App.factory('WebService', ['_', function (_) {

        //test url
        //'http://beau888.dyndns.org:222/DataService/'

        var _self = this;

        _self.url = null;

        //service port
        _self.port = 222;

        //service name
        _self.name = 'DataService';

        //function setUrl
        _self.setUrl = function (url) {

            _self.url = 'http://' + url + ':' + _self.port + '/' + _self.name + '/';
        };

        //function getUrl
        _self.getUrl = function () {

            if (!_.isNull(_self.url) && !_.isUndefined(_self.url))
                return _self.url;
        };

        return _self;
    }]);

//constant for database
App.factory('AppDB', ['_', 'toastr', '$q', '$http', 'WebService', function (_, toastr, $q, $http, webService) {

        var _self = this;

        _self.successCode = 0;

        _self.errorCode = -1000;

        _self._defectedResultData = null;

        _self._areaContractorData = null;
        
        _self._contractorData = null;
        
        _self._basedAreaData = null;

        _self._inspectorData = null;

        _self._customerData = null;

        _self._buildingData = null;

        _self._defectedData = null;

        _self._projectData = null;

        _self._statusData = null;

        _self._levelData = null;

        _self._roomData = null;

        _self._areaData = null;

        //sync data from service
        _self.syncData = function () {

            if (!_.isUndefined(_self._cameraAppDB) && !_.isNull(_self._cameraAppDB)) {

                if (!_.isNull(webService.getUrl()))
                {
                    var _defectedResultUrl = webService.getUrl() + 'GetDefectedResultData';

                    var _areaContractorUrl = webService.getUrl() + 'GetAreaContractorData';

                    var _projectUrl = webService.getUrl() + 'GetProjectinsertsql3';

                    var _contractorUrl = webService.getUrl() + 'GetContractorData';
                    
                    var _basedAreaUrl = webService.getUrl() + 'GetBasedAreaData';

                    var _inspectorUrl = webService.getUrl() + 'GetInspectorData';

                    var _customerUrl = webService.getUrl() + 'GetCustomerData';

                    var _buildingUrl = webService.getUrl() + 'GetBuildingData';

                    var _defectedUrl = webService.getUrl() + 'GetDefectedData';                  
                    
                    var _statusUrl = webService.getUrl() + 'GetStatusData';

                    var _levelUrl = webService.getUrl() + 'GetLevelData';

                    var _roomUrl = webService.getUrl() + 'GetRoomData';

                    var _areaUrl = webService.getUrl() + 'GetAreaData';

                    return $q.all([
                        $http.get(_defectedResultUrl),
                        $http.get(_areaContractorUrl),
                        $http.get(_contractorUrl),
                        $http.get(_basedAreaUrl),
                        $http.get(_inspectorUrl),
                        $http.get(_customerUrl),
                        $http.get(_buildingUrl),
                        $http.get(_defectedUrl),
                        $http.get(_projectUrl),
                        $http.get(_statusUrl),
                        $http.get(_levelUrl),
                        $http.get(_roomUrl),
                        $http.get(_areaUrl)
                    ]);
                }
            }
        };

        //data into tables
        _self.insertData = function (data) {
            
            //BASEDAREA TABLE
            var insertBasedAreaData = function () {
                // Set up the $q deferred object.
                var _deferred = $q.defer();

                if (!_.isNull(_self._basedAreaData) && !_.isUndefined(_self._basedAreaData)) {
                    
                    if (_self._basedAreaData.ErrorCode === _self.errorCode) {

                        _deferred.reject({IsInserted: false, Table: 'BASEDAREA', Status: -1000});
                        return;
                    }

                    var _query = _self._basedAreaData.SQL;

                    _self._cameraAppDB.transaction(function (tx) {

                        tx.executeSql(_query, [], function () {
                            // resolve the promise with the results
                            _deferred.resolve({IsInserted: true, Table: 'BASEDAREA', Status: 200});
                        }, function () {
                            // reject the promise
                            _deferred.reject({IsInserted: false, Table: 'BASEDAREA', Status: -1000});
                        });
                    });
                } else {
                    _deferred.resolve({IsInserted: false, Table: 'BASEDAREA', Status: -1000});
                }

                toastr.success('inserted BASEDAREA data!', 'Information', {
                    timeOut: 5000
                });

                // Return the deferred's promise.
                return _deferred.promise;
            };
            
            //DEFECTED_RESULT TABLE
            var insertDefectedResultData = function () {
                // Set up the $q deferred object.
                var _deferred = $q.defer();

                if (!_.isNull(_self._defectedResultData) && !_.isUndefined(_self._defectedResultData)) {

                    if (_self._defectedResultData.ErrorCode === _self.errorCode) {

                        _deferred.reject({IsInserted: false, Table: 'DEFECTED_RESULT', Status: -1000});
                        return;
                    }

                    var _query = _self._defectedResultData.SQL;

                    _self._cameraAppDB.transaction(function (tx) {

                        tx.executeSql(_query, [], function () {
                            // resolve the promise with the results
                            _deferred.resolve({IsInserted: true, Table: 'DEFECTED_RESULT', Status: 200});
                        }, function () {
                            // reject the promise
                            _deferred.reject({IsInserted: false, Table: 'DEFECTED_RESULT', Status: -1000});
                        });
                    });
                } else {
                    _deferred.resolve({IsInserted: false, Table: 'DEFECTED_RESULT', Status: -1000});
                }

                toastr.success('inserted DEFECTED_RESULT data!', 'Information', {
                    timeOut: 5000
                });

                // Return the deferred's promise.
                return _deferred.promise;
            };

            //AREA_CONTRACTOR TABLE
            var insertAreaContractorData = function () {
                // Set up the $q deferred object.
                var _deferred = $q.defer();

                if (!_.isNull(_self._areaContractorData) && !_.isUndefined(_self._areaContractorData)) {

                    if (_self._areaContractorData.ErrorCode === _self.errorCode) {

                        _deferred.reject({IsInserted: false, Table: 'AREA_CONTRACTOR', Status: -1000});
                        return;
                    }

                    var _query = _self._areaContractorData.SQL;

                    _self._cameraAppDB.transaction(function (tx) {

                        tx.executeSql(_query, [], function () {
                            // resolve the promise with the results
                            _deferred.resolve({IsInserted: true, Table: 'AREA_CONTRACTOR', Status: 200});
                        }, function () {
                            // reject the promise
                            _deferred.reject({IsInserted: false, Table: 'AREA_CONTRACTOR', Status: -1000});
                        });
                    });
                } else {
                    _deferred.resolve({IsInserted: false, Table: 'AREA_CONTRACTOR', Status: -1000});
                }

                toastr.success('inserted AREA_CONTRACTOR data!', 'Information', {
                    timeOut: 5000
                });

                // Return the deferred's promise.
                return _deferred.promise;
            };

            //CONTRACTOR TABLE
            var insertContractorData = function () {
                // Set up the $q deferred object.
                var _deferred = $q.defer();

                if (!_.isNull(_self._contractorData) && !_.isUndefined(_self._contractorData)) {

                    if (_self._contractorData.ErrorCode === _self.errorCode) {

                        _deferred.reject({IsInserted: false, Table: 'CONTRACTOR', Status: -1000});
                        return;
                    }

                    var _query = _self._contractorData.SQL;

                    _self._cameraAppDB.transaction(function (tx) {

                        tx.executeSql(_query, [], function () {
                            // resolve the promise with the results
                            _deferred.resolve({IsInserted: true, Table: 'CONTRACTOR', Status: 200});
                        }, function () {
                            // reject the promise
                            _deferred.reject({IsInserted: false, Table: 'CONTRACTOR', Status: -1000});
                        });
                    });
                } else {
                    _deferred.resolve({IsInserted: false, Table: 'CONTRACTOR', Status: -1000});
                }

                toastr.success('inserted CONTRACTOR data!', 'Information', {
                    timeOut: 5000
                });

                // Return the deferred's promise.
                return _deferred.promise;
            };

            //INSPECTOR TABLE
            var insertInspectorData = function () {
                // Set up the $q deferred object.
                var _deferred = $q.defer();

                if (!_.isNull(_self._inspectorData) && !_.isUndefined(_self._inspectorData)) {

                    if (_self._inspectorData.ErrorCode === _self.errorCode) {

                        _deferred.reject({IsInserted: false, Table: 'INSPECTOR', Status: -1000});
                        return;
                    }

                    var _query = _self._inspectorData.SQL;

                    _self._cameraAppDB.transaction(function (tx) {

                        tx.executeSql(_query, [], function () {
                            // resolve the promise with the results
                            _deferred.resolve({IsInserted: true, Table: 'INSPECTOR', Status: 200});
                        }, function () {
                            // reject the promise
                            _deferred.reject({IsInserted: false, Table: 'INSPECTOR', Status: -1000});
                        });
                    });
                } else {
                    _deferred.resolve({IsInserted: false, Table: 'INSPECTOR', Status: -1000});
                }

                toastr.success('inserted INSPECTOR data!', 'Information', {
                    timeOut: 5000
                });

                // Return the deferred's promise.
                return _deferred.promise;
            };

            //CUSTOMER TABLE
            var insertCustomerData = function () {
                // Set up the $q deferred object.
                var _deferred = $q.defer();

                if (!_.isNull(_self._customerData) && !_.isUndefined(_self._customerData)) {

                    if (_self._customerData.ErrorCode === _self.errorCode) {

                        _deferred.reject({IsInserted: false, Table: 'CUSTOMER', Status: -1000});
                        return;
                    }

                    var _query = _self._customerData.SQL;

                    _self._cameraAppDB.transaction(function (tx) {

                        tx.executeSql(_query, [], function () {
                            // resolve the promise with the results
                            _deferred.resolve({IsInserted: true, Table: 'CUSTOMER', Status: 200});
                        }, function () {
                            // reject the promise
                            _deferred.reject({IsInserted: false, Table: 'CUSTOMER', Status: -1000});
                        });
                    });
                } else {
                    _deferred.resolve({IsInserted: false, Table: 'CUSTOMER', Status: -1000});
                }

                toastr.success('inserted CUSTOMER data!', 'Information', {
                    timeOut: 5000
                });

                // Return the deferred's promise.
                return _deferred.promise;
            };

            //BUILDING TABLE
            var insertBuildingData = function () {
                // Set up the $q deferred object.
                var _deferred = $q.defer();

                if (!_.isNull(_self._buildingData) && !_.isUndefined(_self._buildingData)) {

                    if (_self._buildingData.ErrorCode === _self.errorCode) {

                        _deferred.reject({IsInserted: false, Table: 'BUILDING', Status: -1000});
                        return;
                    }

                    var _query = _self._buildingData.SQL;

                    _self._cameraAppDB.transaction(function (tx) {

                        tx.executeSql(_query, [], function () {
                            // resolve the promise with the results
                            _deferred.resolve({IsInserted: true, Table: 'BUILDING', Status: 200});
                        }, function () {
                            // reject the promise
                            _deferred.reject({IsInserted: false, Table: 'BUILDING', Status: -1000});
                        });
                    });
                } else {
                    _deferred.resolve({IsInserted: false, Table: 'BUILDING', Status: -1000});
                }

                toastr.success('inserted BUILDING data!', 'Information', {
                    timeOut: 5000
                });

                // Return the deferred's promise.
                return _deferred.promise;
            };

            //DEFECTED TABLE
            var insertDefectedData = function () {
                // Set up the $q deferred object.
                var _deferred = $q.defer();

                if (!_.isNull(_self._defectedData) && !_.isUndefined(_self._defectedData)) {

                    if (_self._defectedData.ErrorCode === _self.errorCode) {

                        _deferred.reject({IsInserted: false, Table: 'DEFECTED', Status: -1000});
                        return;
                    }

                    var _query = _self._defectedData.SQL;

                    _self._cameraAppDB.transaction(function (tx) {

                        tx.executeSql(_query, [], function () {
                            // resolve the promise with the results
                            _deferred.resolve({IsInserted: true, Table: 'DEFECTED', Status: 200});
                        }, function () {
                            // reject the promise
                            _deferred.reject({IsInserted: false, Table: 'DEFECTED', Status: -1000});
                        });
                    });
                } else {
                    _deferred.resolve({IsInserted: false, Table: 'DEFECTED', Status: -1000});
                }

                toastr.success('inserted DEFECTED data!', 'Information', {
                    timeOut: 5000
                });

                // Return the deferred's promise.
                return _deferred.promise;
            };

            //PROJECT TABLE
            var insertProjectData = function () {
                // Set up the $q deferred object.
                var _deferred = $q.defer();

                if (!_.isNull(_self._projectData) && !_.isUndefined(_self._projectData)) {

                    if (_self._projectData.ErrorCode === _self.errorCode) {

                        _deferred.reject({IsInserted: false, Table: 'PROJECT', Status: -1000});
                        return;
                    }

                    var _query = _self._projectData.SQL;

                    _self._cameraAppDB.transaction(function (tx) {

                        tx.executeSql(_query, [], function () {
                            // resolve the promise with the results
                            _deferred.resolve({IsInserted: true, Table: 'PROJECT', Status: 200});
                        }, function () {
                            // reject the promise
                            _deferred.reject({IsInserted: false, Table: 'PROJECT', Status: -1000});
                        });
                    });
                } else {
                    _deferred.resolve({IsInserted: false, Table: 'PROJECT', Status: -1000});
                }

                toastr.success('inserted PROJECT data!', 'Information', {
                    timeOut: 5000
                });

                // Return the deferred's promise.
                return _deferred.promise;
            };

            //STATUS TABLE
            var insertStatusData = function () {
                // Set up the $q deferred object.
                var _deferred = $q.defer();

                if (!_.isNull(_self._statusData) && !_.isUndefined(_self._statusData)) {

                    if (_self._statusData.ErrorCode === _self.errorCode) {

                        _deferred.reject({IsInserted: false, Table: 'STATUS', Status: -1000});
                        return;
                    }

                    var _query = _self._statusData.SQL;

                    _self._cameraAppDB.transaction(function (tx) {

                        tx.executeSql(_query, [], function () {
                            // resolve the promise with the results
                            _deferred.resolve({IsInserted: true, Table: 'STATUS', Status: 200});
                        }, function () {
                            // reject the promise
                            _deferred.reject({IsInserted: false, Table: 'STATUS', Status: -1000});
                        });
                    });
                } else {
                    _deferred.resolve({IsInserted: false, Table: 'STATUS', Status: -1000});
                }

                toastr.success('inserted STATUS data!', 'Information', {
                    timeOut: 5000
                });

                // Return the deferred's promise.
                return _deferred.promise;
            };

            //LEVEL TABLE
            var insertLevelData = function () {
                // Set up the $q deferred object.
                var _deferred = $q.defer();

                if (!_.isNull(_self._levelData) && !_.isUndefined(_self._levelData)) {

                    if (_self._levelData.ErrorCode === _self.errorCode) {
                        
                        _deferred.reject({IsInserted: false, Table: 'LEVEL', Status: -1000});
                        return;
                    }

                    var _query = _self._levelData.SQL;

                    _self._cameraAppDB.transaction(function (tx) {

                        tx.executeSql(_query, [], function () {
                            // resolve the promise with the results
                            _deferred.resolve({IsInserted: true, Table: 'LEVEL', Status: 200});
                        }, function () {
                            // reject the promise
                            _deferred.reject({IsInserted: false, Table: 'LEVEL', Status: -1000});
                        });
                    });
                } else {
                    _deferred.resolve({IsInserted: false, Table: 'LEVEL', Status: -1000});
                }

                toastr.success('inserted LEVEL data!', 'Information', {
                    timeOut: 5000
                });

                // Return the deferred's promise.
                return _deferred.promise;
            };

            //ROOM TABLE
            var insertRoomData = function () {
                // Set up the $q deferred object.
                var _deferred = $q.defer();

                if (!_.isNull(_self._roomData) && !_.isUndefined(_self._roomData)) {

                    if (_self._roomData.ErrorCode === _self.errorCode) {
                        
                        _deferred.reject({IsInserted: false, Table: 'ROOM', Status: -1000});
                        return;
                    }
                    
                    var _query = _self._roomData.SQL;

                    _self._cameraAppDB.transaction(function (tx) {

                        tx.executeSql(_query, [], function () {
                            // resolve the promise with the results
                            _deferred.resolve({IsInserted: true, Table: 'ROOM', Status: 200});
                        }, function () {
                            // reject the promise
                            _deferred.reject({IsInserted: false, Table: 'ROOM', Status: -1000});
                        });
                    });
                } else {
                    _deferred.resolve({IsInserted: false, Table: 'ROOM', Status: -1000});
                }

                toastr.success('inserted ROOM data!', 'Information', {
                    timeOut: 5000
                });

                // Return the deferred's promise.
                return _deferred.promise;
            };

            //AREA TABLE
            var insertAreaData = function () {
                // Set up the $q deferred object.
                var _deferred = $q.defer();

                if (!_.isNull(_self._areaData) && !_.isUndefined(_self._areaData)) {

                    if (_self._areaData.ErrorCode === _self.errorCode) {
                        
                        _deferred.reject({IsInserted: false, Table: 'AREA', Status: -1000});
                        return;
                    }
                    
                    var _query = _self._areaData.SQL;

                    _self._cameraAppDB.transaction(function (tx) {

                        tx.executeSql(_query, [], function () {
                            // resolve the promise with the results
                            _deferred.resolve({IsInserted: true, Table: 'AREA', Status: 200});
                        }, function () {
                            // reject the promise
                            _deferred.reject({IsInserted: false, Table: 'AREA', Status: -1000});
                        });
                    });
                } else {
                    _deferred.resolve({IsInserted: false, Table: 'AREA', Status: -1000});
                }

                toastr.success('inserted AREA data!', 'Information', {
                    timeOut: 5000
                });

                // Return the deferred's promise.
                return _deferred.promise;
            };

            _self._defectedResultData = JSON.parse(data[0].data);
           
            _self._areaContractorData = JSON.parse(data[1].data);

            _self._contractorData = JSON.parse(data[2].data);
            
            _self._basedAreaData = JSON.parse(data[3].data);

            _self._inspectorData = JSON.parse(data[4].data);

            _self._customerData = JSON.parse(data[5].data);

            _self._buildingData = JSON.parse(data[6].data);

            _self._defectedData = JSON.parse(data[7].data);

            _self._projectData = JSON.parse(data[8].data);

            _self._statusData = JSON.parse(data[9].data);

            _self._levelData = JSON.parse(data[10].data);

            _self._roomData = JSON.parse(data[11].data);

            _self._areaData = JSON.parse(data[12].data);

            return $q.all([
                insertDefectedResultData(),
                insertAreaContractorData(),
                insertContractorData(),
                insertBasedAreaData(),
                insertInspectorData(),
                insertCustomerData(),
                insertBuildingData(),
                insertDefectedData(),
                insertProjectData(),
                insertStatusData(),
                insertLevelData(),
                insertRoomData(),
                insertAreaData()
            ]);
        };

        //open database
        _self.openDataBase = function (callBack) {
            // Cordova is ready
            var onDeviceReady = function () {

                var _onCreateDBSuccess = function () {

                    _self._cameraAppDB.executeSql("PRAGMA synchronous=OFF");
                    _self._cameraAppDB.executeSql("PRAGMA journal_mode=MEMORY");

                    if (_.isFunction(callBack))
                        callBack();
                };

                var _onCreateDBFailed = function (err) {

                    toastr.error(err.message, 'Error', {
                        timeOut: 5000
                    });
                };

                _self._cameraAppDB = window.sqlitePlugin.openDatabase({name: "CameraApp"}, _onCreateDBSuccess, _onCreateDBFailed);
            };

            // Wait for Cordova to load
            document.addEventListener("deviceready", onDeviceReady, false);
        };

        //propert of TABLE [* SETUP]
        //@CREATE
        _self.createSetupTable = function () {

            var _onCreateSuccess = function () {
                // success creating setup table
                toastr.success('Create SETUP table', 'Information', {
                    timeOut: 5000
                });
            };

            var _onCreateFailed = function () {
                toastr.error('Could not create SETUP table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS SETUP (SETUP_ID integer primary key, NetworkAddr text, LastSync text)', [], _onCreateSuccess, _onCreateFailed);
                });
            }
        };

        //propert of TABLE [* SETUP]
        //@DROP
        _self.dropSetupTable = function () {

            var _onDropSuccess = function () {
                // success drop setup table
            };

            var _onDropFailed = function () {
                toastr.error('Could not drop SETUP table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('DROP TABLE IF EXISTS SETUP', [], _onDropSuccess, _onDropFailed);
                });
            }
        };

        //property of TABLE [* INSPECTOR]
        //@CREATE
        _self.createInspectorTable = function () {

            var _onCreateSuccess = function () {
                // success creating inspector table
                toastr.success('Create INSPECTOR table', 'Information', {
                    timeOut: 5000
                });
            };

            var _onCreateFailed = function () {
                toastr.error('Could not create INSPECTOR table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('CREATE TABLE IF NOT EXISTS INSPECTOR (INSPECTOR_ID integer primary key, ID text, Code text, FullName text, UserName text, Password text)', [], _onCreateSuccess, _onCreateFailed);
                });
            }
        };

        //property of TABLE [* INSPECTOR]
        //@DROP
        _self.dropInspectorTable = function () {

            var _onDropSuccess = function () {
                // success drop inspector table
            };

            var _onDropFailed = function () {
                toastr.error('Could not drop INSPECTOR table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('DROP TABLE IF EXISTS INSPECTOR', [], _onDropSuccess, _onDropFailed);
                });
            }
        };

        //property of TABLE [* PROJECT]
        //@CREATE
        _self.createProjectTable = function () {

            var _onCreateSuccess = function () {
                // success creating project table
                toastr.success('Create PROJECT table', 'Information', {
                    timeOut: 5000
                });
            };

            var _onCreateFailed = function () {
                toastr.error('Could not create PROJECT table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('CREATE TABLE IF NOT EXISTS PROJECT (PROJECT_ID integer primary key, ID text, Customer text, Code text, Description text)', [], _onCreateSuccess, _onCreateFailed);
                });
            }
        };

        //property of TABLE [* PROJECT]
        //@DROP
        _self.dropProjectTable = function () {

            var _onDropSuccess = function () {
                // success drop project table
            };

            var _onDropFailed = function () {
                toastr.error('Could not drop PROJECT table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('DROP TABLE IF EXISTS PROJECT', [], _onDropSuccess, _onDropFailed);
                });
            }
        };

        //property of TABLE [* BUILDING]
        //@CREATE
        _self.createBuildingTable = function () {

            var _onCreateSuccess = function () {
                // success creating building table
                toastr.success('Create BUILDING table', 'Information', {
                    timeOut: 5000
                });
            };

            var _onCreateFailed = function () {
                toastr.error('Could not create BUILDING table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('CREATE TABLE IF NOT EXISTS BUILDING (BUILD_ID integer primary key, ID text, Code text, Project text, Description text)', [], _onCreateSuccess, _onCreateFailed);
                });
            }
        };

        //property of TABLE [* BUILDING]
        //@DROP
        _self.dropBuildingTable = function () {

            var _onDropSuccess = function () {
                // success drop building table
            };

            var _onDropFailed = function () {
                toastr.error('Could not drop BUILDING table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('DROP TABLE IF EXISTS BUILDING', [], _onDropSuccess, _onDropFailed);
                });
            }
        };

        //property of TABLE [* LEVEL]
        //@CREATE
        _self.createLevelTable = function () {

            var _onCreateSuccess = function () {
                // success creating level table
                toastr.success('Create LEVEL table', 'Information', {
                    timeOut: 5000
                });
            };

            var _onCreateFailed = function () {
                toastr.error('Could not create LEVEL table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('CREATE TABLE IF NOT EXISTS LEVEL (LEVEL_ID integer primary key, ID text, Code text, Building text, Description text)', [], _onCreateSuccess, _onCreateFailed);
                });
            }
        };

        //property of TABLE [* LEVEL]
        //@DROP
        _self.dropLevelTable = function () {

            var _onDropSuccess = function () {
                // success drop level table
            };

            var _onDropFailed = function () {
                toastr.error('Could not drop LEVEL table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('DROP TABLE IF EXISTS LEVEL', [], _onDropSuccess, _onDropFailed);
                });
            }
        };

        //property of TABLE [* ROOM]
        //@CREATE
        _self.createRoomTable = function () {

            var _onCreateSuccess = function () {
                // success creating room table
                toastr.success('Create ROOM table', 'Information', {
                    timeOut: 5000
                });
            };

            var _onCreateFailed = function () {
                toastr.error('Could not create ROOM table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('CREATE TABLE IF NOT EXISTS ROOM (ROOM_ID integer primary key, ID text, Code text, Level text, Description text)', [], _onCreateSuccess, _onCreateFailed);
                });
            }
        };

        //property of TABLE [* ROOM]
        //@DROP
        _self.dropRoomTable = function () {

            var _onDropSuccess = function () {
                // success drop room table
            };

            var _onDropFailed = function () {
                toastr.error('Could not drop ROOM table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('DROP TABLE IF EXISTS ROOM', [], _onDropSuccess, _onDropFailed);
                });
            }
        };

        //property of TABLE [* STATUS]
        //@CREATE
        _self.createStatusTable = function () {

            var _onCreateSuccess = function () {
                // success creating status table
                toastr.success('Create STATUS table', 'Information', {
                    timeOut: 5000
                });
            };

            var _onCreateFailed = function () {
                toastr.error('Could not create STATUS table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {


                    tx.executeSql('CREATE TABLE IF NOT EXISTS STATUS (ST_ID integer primary key, ID text, Description text)', [], _onCreateSuccess, _onCreateFailed);
                });
            }
        };

        //property of TABLE [* STATUS]
        //@DROP
        _self.dropStatusTable = function () {

            var _onDropSuccess = function () {
                // success drop status table
            };

            var _onDropFailed = function () {
                toastr.error('Could not drop STATUS table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('DROP TABLE IF EXISTS STATUS', [], _onDropSuccess, _onDropFailed);
                });
            }
        };

        //property of TABLE [* CONTRACTOR]
        //@CREATE
        _self.createContractorTable = function () {

            var _onCreateSuccess = function () {
                // success creating contractor table
                toastr.success('Create CONTRACTOR table', 'Information', {
                    timeOut: 5000
                });
            };

            var _onCreateFailed = function () {
                toastr.error('Could not create CONTRACTOR table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('CREATE TABLE IF NOT EXISTS CONTRACTOR (CT_ID integer primary key, ID text, Code text, FullName text)', [], _onCreateSuccess, _onCreateFailed);
                });
            }
        };

        //property of TABLE [* CONTRACTOR]
        //@DROP
        _self.dropContractorTable = function () {

            var _onDropSuccess = function () {
                // success drop contractor table
            };

            var _onDropFailed = function () {
                toastr.error('Could not drop CONTRACTOR table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('DROP TABLE IF EXISTS CONTRACTOR', [], _onDropSuccess, _onDropFailed);
                });
            }
        };

        //property of TABLE [* DEFECTED]
        //@CREATE
        _self.createDefectedTable = function () {

            var _onCreateSuccess = function () {
                // success creating defected table
                toastr.success('Create DEFECTED table', 'Information', {
                    timeOut: 5000
                });
            };

            var _onCreateFailed = function () {
                toastr.error('Could not create DEFECTED table', 'Error', {
                    timeOut: 5000
                });
            };

            var _query = 'CREATE TABLE IF NOT EXISTS DEFECTED (DF_ID integer primary key, ID text, Code text, DateCreated text' +
                    ', Project text, Building text, Level text, Room text, Area text, Inspector text, Contractor text, Imei text' +
                    ', DefectedImage text, Status text, Closed text, Comment text, NewRecord integer)';

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    _self._cameraAppDB.executeSql(_query, [], _onCreateSuccess, _onCreateFailed);
                });
            }
        };

        //property of TABLE [* DEFECTED]
        //@DROP
        _self.dropDefectedTable = function () {

            var _onDropSuccess = function () {
                // success drop defected table
            };

            var _onDropFailed = function () {
                toastr.error('Could not drop DEFECTED table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('DROP TABLE IF EXISTS DEFECTED', [], _onDropSuccess, _onDropFailed);
                });
            }
        };

        //property of TABLE [* AREA]
        //@CREATE
        _self.createAreaTable = function () {

            var _onCreateSuccess = function () {
                // success creating area table
                toastr.success('Create AREA table', 'Information', {
                    timeOut: 5000
                });
            };

            var _onCreateFailed = function () {
                toastr.error('Could not create AREA table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('CREATE TABLE IF NOT EXISTS AREA (AREA_ID integer primary key, ID text, Code text, Project text, Description text)', [], _onCreateSuccess, _onCreateFailed);
                });
            }
        };

        //property of TABLE [* AREA]
        //@DROP
        _self.dropAreaTable = function () {

            var _onDropSuccess = function () {
                // success drop area table
            };

            var _onDropFailed = function () {
                toastr.error('Could not drop AREA table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('DROP TABLE IF EXISTS AREA', [], _onDropSuccess, _onDropFailed);
                });
            }
        };
        
        //property of TABLE [* AREA]
        //@CREATE
        _self.createAreaTable = function () {

            var _onCreateSuccess = function () {
                // success creating area table
                toastr.success('Create AREA table', 'Information', {
                    timeOut: 5000
                });
            };

            var _onCreateFailed = function () {
                toastr.error('Could not create AREA table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('CREATE TABLE IF NOT EXISTS AREA (AREA_ID integer primary key, ID text, Code text, Project text, Description text)', [], _onCreateSuccess, _onCreateFailed);
                });
            }
        };

        //property of TABLE [* AREA]
        //@DROP
        _self.dropAreaTable = function () {

            var _onDropSuccess = function () {
                // success drop area table
            };

            var _onDropFailed = function () {
                toastr.error('Could not drop AREA table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('DROP TABLE IF EXISTS AREA', [], _onDropSuccess, _onDropFailed);
                });
            }
        };

        //property of TABLE [* BASED AREA]
        //@CREATE
        _self.createBasedAreaTable = function () {

            var _onCreateSuccess = function () {
                // success creating basedarea table
                toastr.success('Create BASEDAREA table', 'Information', {
                    timeOut: 5000
                });
            };

            var _onCreateFailed = function () {
                toastr.error('Could not create BASEDAREA table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('CREATE TABLE IF NOT EXISTS BASEDAREA (BASED_ID integer primary key, ID text, Code text, Description text)', [], _onCreateSuccess, _onCreateFailed);
                });
            }
        };
        
         //property of TABLE [* BASED AREA]
        //@DROP
        _self.dropBasedAreaTable = function () {

            var _onDropSuccess = function () {
                // success drop basedarea table
            };

            var _onDropFailed = function () {
                toastr.error('Could not drop BASEDAREA table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('DROP TABLE IF EXISTS BASEDAREA', [], _onDropSuccess, _onDropFailed);
                });
            }
        };

        //property of TABLE [* AREA CONTRACTOR]
        //@CREATE
        _self.createAreaContractorTable = function () {

            var _onCreateSuccess = function () {
                // success creating area_contractor table
                toastr.success('Create AREA_CONTRACTOR table', 'Information', {
                    timeOut: 5000
                });
            };

            var _onCreateFailed = function () {
                toastr.error('Could not create AREA_CONTRACTOR table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('CREATE TABLE IF NOT EXISTS AREA_CONTRACTOR (ARCT_ID integer primary key, ID text, Contractor text, Comment text, Area text)', [], _onCreateSuccess, _onCreateFailed);
                });
            }
        };

        //property of TABLE [* AREA CONTRACTOR]
        //@DROP
        _self.dropAreaContractorTable = function () {

            var _onDropSuccess = function () {
                // success drop area_contractor table
            };

            var _onDropFailed = function () {
                toastr.error('Could not drop AREA_CONTRACTOR table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('DROP TABLE IF EXISTS AREA_CONTRACTOR', [], _onDropSuccess, _onDropFailed);
                });
            }
        };

        //property of TABLE [* DEFECTED RESULT]
        //@CREATE
        _self.createDefectedResultTable = function () {

            var _onCreateSuccess = function () {
                // success creating defected_result table
                toastr.success('Create DEFECTED_RESULT table', 'Information', {
                    timeOut: 5000
                });
            };

            var _onCreateFailed = function () {
                toastr.error('Could not create DEFECTED_RESULT table', 'Error', {
                    timeOut: 5000
                });
            };

            var _query = 'CREATE TABLE IF NOT EXISTS DEFECTED_RESULT (DR_ID integer primary key, ID text, Code text, Defected text' +
                    ', ResultedBy text, ResultDate text, Result text, Imei text, Comment text, NewRecord integer)';

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql(_query, [], _onCreateSuccess, _onCreateFailed);
                });
            }
        };

        //property of TABLE [* DEFECTED RESULT]
        //@DROP
        _self.dropDefectedResultTable = function () {

            var _onDropSuccess = function () {
                // success drop defected_result table
            };

            var _onDropFailed = function () {
                toastr.error('Could not drop DEFECTED_RESULT table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('DROP TABLE IF EXISTS DEFECTED_RESULT', [], _onDropSuccess, _onDropFailed);
                });
            }
        };

        //property of TABLE [* CUSTOMER]
        //@CREATE
        _self.createCustomerTable = function () {

            var _onCreateSuccess = function () {
                // success creating customer table
                toastr.success('Create CUSTOMER table', 'Information', {
                    timeOut: 5000
                });
            };

            var _onCreateFailed = function () {
                toastr.error('Could not create CUSTOMER table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('CREATE TABLE IF NOT EXISTS CUSTOMER (CUST_ID integer primary key, ID text, Code text, Description text)', [], _onCreateSuccess, _onCreateFailed);
                });
            }
        };

        //property of TABLE [* CUSTOMER]
        //@DROP
        _self.dropCustomerTable = function () {

            var _onDropSuccess = function () {
                // success drop customer table
            };

            var _onDropFailed = function () {
                toastr.error('Could not drop CUSTOMER table', 'Error', {
                    timeOut: 5000
                });
            };

            if (!_.isNull(_self._cameraAppDB) && !_.isUndefined(_self._cameraAppDB)) {

                _self._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('DROP TABLE IF EXISTS CUSTOMER', [], _onDropSuccess, _onDropFailed);
                });
            }
        };

        //@DROP [* ALL TABLE]
        _self.dropAllTables = function () {

            _self.dropAreaTable();
            _self.dropRoomTable();
            _self.dropLevelTable();
            _self.dropStatusTable();
            _self.dropProjectTable();
            _self.dropBuildingTable();
            _self.dropDefectedTable();
            _self.dropCustomerTable();
            _self.dropBasedAreaTable();
            _self.dropInspectorTable();
            _self.dropContractorTable();
            _self.dropAreaContractorTable();
            _self.dropDefectedResultTable();
        };

        //@CREATE [* ALL TABLE]
        _self.createAllTables = function () {

            _self.createAreaTable();
            _self.createRoomTable();
            _self.createSetupTable();
            _self.createLevelTable();
            _self.createStatusTable();
            _self.createProjectTable();
            _self.createBuildingTable();
            _self.createDefectedTable();
            _self.createCustomerTable();
            _self.createBasedAreaTable();
            _self.createInspectorTable();
            _self.createContractorTable();
            _self.createAreaContractorTable();
            _self.createDefectedResultTable();
        };

        return _self;
    }]);

//controller
App.controller('MainController', ['$scope', 'WebService', 'AppDB', '_', '$location', 'toastr', function ($scope, webService, AppDB, _, $location, toastr) {
        
       $scope.$on('$viewContentLoaded', function() {
            
            $.material.init();
       });

        var openDBSucceed = function () {
            //create tables on initialized
            if (!_.isNull(AppDB) && !_.isUndefined(AppDB))
            {
                //create ALL TABLE
                AppDB.createAllTables();
            }

            if (!_.isNull(AppDB._cameraAppDB) && !_.isUndefined(AppDB._cameraAppDB))
            {
                //check if has inspector data
                var _onSetupSuccess = function (tx, results) {

                    if (results.rows.length === 0) {

                        toastr.warning('System does not detect Network config!', 'Warning', {
                            timeOut: 5000
                        });

                        var _setupViewPath = '/setupView';

                        $scope.$apply(function () {
                            $location.path(_setupViewPath).replace();
                        });
                    } else {

                        var _setupData = results.rows.item(0);

                        var _syncViewPath = '/syncView';

                        webService.setUrl(_setupData.NetworkAddr);

                        $scope.$apply(function () {
                            $location.path(_syncViewPath).replace();
                        });
                    }
                };

                var _onSetupFailed = function (e) {

                    toastr.error(e.message, 'Error', {
                        timeOut: 5000
                    });
                };

                var _onInspectorSuccess = function (tx, results) {

                    if (results.rows.length > 0) {

//                        toastr.success('Inspector data detected', 'Information', {
//                            timeOut: 5000
//                        });

                        var _loginViewPath = '/loginView';
                        //change page to login view page
                        $location.path(_loginViewPath).replace();
                    } else {

                        AppDB._cameraAppDB.transaction(function (tx) {

                            tx.executeSql('SELECT * FROM SETUP', [], _onSetupSuccess, _onSetupFailed);
                        });
                    }
                };

                var _onInspectorFailed = function (e) {

                    toastr.error(e.message, 'Error', {
                        timeOut: 5000
                    });
                };

                AppDB._cameraAppDB.transaction(function (tx) {

                    tx.executeSql('SELECT * FROM INSPECTOR', [], _onInspectorSuccess, _onInspectorFailed);
                });
            }
        };

        //function open database on initialized
        if (!_.isNull(AppDB) && !_.isUndefined(AppDB)) {

            AppDB.openDataBase(openDBSucceed);
        }
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
                when('/syncView', {
                    templateUrl: 'sync_components/sync.html',
                    controller: 'SyncCtrl'
                }).
                when('/itemView', {
                    templateUrl: 'item_components/item.html',
                    controller: 'ItemCtrl'
                }).
                when('/wsTestView', {
                    templateUrl: 'webservice_components/ws.html',
                    controller: 'WSCtrl'
                }).
                when('/setupView', {
                    templateUrl: 'setup_components/setup.html',
                    controller: 'SetupCtrl'
                }).
                when('/projectView', {
                    templateUrl: 'project_components/project.html',
                    controller: 'ProjectCtrl'
                }).
                when('/activityView', {
                    templateUrl: 'activities_components/activity.html',
                    controller: 'ActivityCtrl'
                });
                //otherwise({redirectTo: '/activityView'});
    }]);

