/**
 * @description
 * Directive for showing/hiding loader indicator based on the number of pending HTTP requests.
 */

(function () {
    'use strict';

    var loaderModule = angular.module('readerApp.directive.loader', []);
    loaderModule.controller('loaderController', loaderController);

    loaderController.$inject = ['$document'];
    function loaderController($document) {
        var ctrl = this;

        this.active = false;
        this.body = angular.element($document[0].body);
        this.overlay = angular.element('<div class="sr-overlay"></div>');

        /**
         * @description
         * Resolve "active" loader class.
         *
         * @param  {Integer} | requests - pending HTTP requests.
         * @return {Bool}
         * @public
         */
        this.resolveClass = function (requests) {
            ctrl.active = (requests > 0);
            _resolveOverlay();
        };

        /**
         * @description
         * Append overlay to body on init.
         *
         * @public
         */
        this.setOverlay = function () {
            ctrl.body.append(ctrl.overlay);
        };

        /**
         * @description
         * Resolve body class.
         *
         * @private
         */
        function _resolveOverlay () {
            if (ctrl.active) {
                ctrl.body.addClass('-loader-active');
            } else {
                ctrl.body.removeClass('-loader-active');
            }
        }
    }

    loaderModule.directive('loader', loader);

    loader.$inject = ['$http'];
    function loader($http) {
        return {
            restrict: 'A',
            controller: 'loaderController',
            controllerAs: 'lctrl',
            link: function (scope, elem, attrs, ctrl) {
                ctrl.setOverlay();

                scope.$watch(function () {
                    return $http.pendingRequests.length;
                }, ctrl.resolveClass);

                scope.$on('$destroy', function () {
                    elem.off();
                });
            }
        };
    }

    loaderModule.directive('loaderIndicator', loaderIndicator);

    loaderIndicator.$inject = [];
    function loaderIndicator () {
        return {
            replace: true,
            restrict: 'E',
            require: '^loader',
            template: '<div class="sr-loader" ng-class="{\'active\': lctrl.active}">' +
                        '<i class="sr-icon -icon-loader icon-spinner9"></i>' +
                      '</div>',
            link: function (scope, elem) {
                scope.$on('$destroy', function () {
                    elem.off();
                });
            }
        };
    }
})();