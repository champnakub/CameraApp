'use strict';

var Project = angular.module('myApp.ProjectView', ['ngRoute']);

Project.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/projectView', {
            templateUrl: 'project_components/project.html',
            controller: 'ProjectCtrl'
        });
    }]);

Project.controller('ProjectCtrl', ['$scope', '$location', 'AppDB', 'toastr', 'Project', function ($scope, $location, AppDB, toastr, Project) {
        
        var toLogin = function (e) {

            var _loginViewPath = '/loginView';

            var _confirmDlg = confirm('Are you sure you want to log out?');

            if (_confirmDlg === true) {
                
                document.removeEventListener('backbutton', toLogin);
                
                //change page to login view page
                $scope.$apply(function () {
                    $location.path(_loginViewPath).replace();
                });
            }
        };
        
        document.addEventListener('backbutton', toLogin, false);
        
        $scope._projectResults = [];

        $scope.onProjectData = function (selectedProject) {

            document.removeEventListener('backbutton', toLogin);

            Project.setProjectData(selectedProject);

            var _activityViewPath = '/activityView';
            //change page to project view path
            $location.path(_activityViewPath);
        };

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