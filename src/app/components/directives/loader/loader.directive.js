/**
 * @description
 * Directive for showing/hiding loader indicator based on the number of pending HTTP requests.
 */

(function () {
    'use strict';

    var loaderModule = angular.module('readerApp.directive.loader', []);
    loaderModule.controller('loaderController', loaderController);

    loaderController.$inject = ['$window', '$document'];
    function loaderController($window, $document) {
        var ctrl = this;

        this.active = false;
        this.isSmallScreen = false;
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
        this.resolveClassActive = function (requests) {
            ctrl.active = (requests > 0);
            _resolveOverlayActive();
        };

        /**
         * @description
         * Resolve class when small screen.
         *
         * @param  {Integer}
         * @return {Bool}
         * @public
         */
        this.resolveClassSmall = function (width) {
            ctrl.isSmallScreen = (width <= 992);
            _resolveOverlaySmall();
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
         * Get window width.
         *
         * @return {Integer}
         * @public
         */
        this.getWinWidth = function () {
            return $window.innerWidth;
        };

        /**
         * @description
         * Resolve body class when loader active.
         *
         * @private
         */
        function _resolveOverlayActive () {
            return (ctrl.active) ? ctrl.body.addClass('-loader-active') : ctrl.body.removeClass('-loader-active');
        }

        /**
         * @description
         * Resolve body class when small screen.
         *
         * @private
         */
        function _resolveOverlaySmall () {
            return (ctrl.isSmallScreen) ? ctrl.body.addClass('-screen-sm') : ctrl.body.removeClass('-screen-sm');
        }
    }

    loaderModule.directive('loader', loader);

    loader.$inject = ['$http', '$window'];
    function loader($http, $window) {
        return {
            restrict: 'A',
            controller: 'loaderController',
            controllerAs: 'lctrl',
            link: function (scope, elem, attrs, ctrl) {
                var w = angular.element($window);
                ctrl.setOverlay();

                w.bind('resize', function () {
                    scope.$apply();
                });

                scope.$watch(function () {
                    return ctrl.getWinWidth();
                }, ctrl.resolveClassSmall);

                scope.$watch(function () {
                    return $http.pendingRequests.length;
                }, ctrl.resolveClassActive);

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
            template: ''.concat('<div class="sr-loader" ng-class="{\'active\': lctrl.active}">',
                        '<i class="sr-icon -icon-loader icon-spinner9"></i>',
                      '</div>'),
            link: function (scope, elem) {
                scope.$on('$destroy', function () {
                    elem.off();
                });
            }
        };
    }
})();