'use strict';

var Item = angular.module('myApp.ItemView', ['ngRoute']);

//config
Item.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/itemView', {
            templateUrl: 'item_components/item.html',
            controller: 'ItemCtrl'
        });
    }]);

//directive
Item.directive('setHeight', function ($window) {
    return{
        link: function (scope, element, attrs) {
            element.css('height', 150);
        }
    };
});

//controller
Item.controller('ItemCtrl', ['$scope', '_', 'cfpLoadingBar', function ($scope, _, cfpLoadingBar) {

        $scope.Images = [];
        
        //start the loading bar
        $scope.onLoading = function ()
        {
            cfpLoadingBar.start();
        };

        //hide the loading bar
        $scope.onLoaded = function ()
        {
            cfpLoadingBar.complete();
        };

        //render images
        var renderImages = function ()
        {
            for (var i = 0; i < 10000; i++)
            {
                var _imageIdx = _.random(1, 12);

                var _image = _imageIdx + '.jpg';

                $scope.Images.push({
                    name: "champ_" + i,
                    url: 'images/' + _image
                });
            } ;

            $scope.onLoaded();
        };

        //initializer
        $scope.init = function () {

            $scope.onLoading();

            renderImages();
        };
    }]);