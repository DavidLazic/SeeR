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
            (ctrl.active) ? ctrl.body.addClass('-loader-active') : ctrl.body.removeClass('-loader-active');
        }
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

    loaderIndicator.$inject = ['$http', '$document'];
    function loaderIndicator ($http, $document) {
        return {
            restrict: 'A',
            require: '^loader',
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
})();