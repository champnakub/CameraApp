'use strict';

var Item = angular.module('myApp.ItemView', ['ngRoute']);

Item.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/itemView', {
            templateUrl: 'item_components/item.html',
            controller: 'ItemCtrl'
        });
    }]);

Item.controller('ItemCtrl', ['$scope', function ($scope) {

    }]);