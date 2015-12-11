'use strict';

var Project = angular.module('myApp.ProjectView', ['ngRoute']);

Project.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/projectView', {
            templateUrl: 'project_components/project.html',
            controller: 'ProjectCtrl'
        });
    }]);

Project.directive('projectClick', ['$location',
    function ($location) {
        return {
            link: function (scope, element, attrs) {
                element.click(function (e) {

                    var _activityViewPath = '/activityView';
                    //change page to project view page
                    scope.$apply(function () {
                        $location.path(_activityViewPath);
                    });
                });
            }
        };
    }]);

Project.controller('ProjectCtrl', ['$scope', '$location', 'AppDB', 'toastr', function ($scope, $location, AppDB, toastr) {

        $scope._projectResults = [];

        var _onQuerySuccess = function (tx, results) {

            var _projectDatas = results;

            for (var i = 0; i < _projectDatas.rows.length; i++) {

                var _projectData = {
                    ID: _projectDatas.rows.item(i).ID,
                    Description: _projectDatas.rows.item(i).Description
                };

                $scope.$apply(function () {
                    $scope._projectResults.push(_projectData);
                });
            }
            ;
        };

        var _onQueryFailed = function () {

            toastr.error('Could not get Project Data.', 'Error', {
                timeOut: 5000
            });
        };

        AppDB._cameraAppDB.transaction(function (tx) {

            tx.executeSql('SELECT * FROM PROJECT', [], _onQuerySuccess, _onQueryFailed);
        });
    }]);