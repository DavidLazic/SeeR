/**
 * @description
 * Directive for showing/hiding loader indicator based on the number of pending HTTP requests.
 */

(function () {
    'use strict';

    var loaderModule = angular.module('readerApp.directive.loader', []);
    loaderModule.controller('loaderController', loaderController);

    loaderController.$inject = [];
    function loaderController() {
        var ctrl = this;

        this.active = false;

        this.resolveClass = function (requests) {
            ctrl.active = (requests > 0);
        };
    }

    loaderModule.directive('loader', loader);

    loader.$inject = [];
    function loader() {
        return {
            replace: true,
            restrict: 'E',
            scope: {},
            controller: 'loaderController',
            controllerAs: 'lctrl',
            template: '<div class="sr-loader" ng-class="{\'active\': lctrl.active}" loader-indicator>' +
                        '<i class="sr-icon -icon-loader icon-spinner9"></i>' +
                      '</div>'
        };
    }

    loaderModule.directive('loaderIndicator', loaderIndicator);

    loaderIndicator.$inject = ['$http'];
    function loaderIndicator ($http) {
        return {
            restrict: 'A',
            require: '^loader',
            link: function (scope, elem, attrs, ctrl) {
                var requests = $http.pendingRequests;

                scope.$watch(function () {
                    return requests.length;
                }, ctrl.resolveClass);
            }
        };
    }
})();