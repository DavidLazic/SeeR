/**
 * @description
 * Directive for showing/hiding scroll arrow indicator if element can be scrolled more.
 */

(function() {
    'use strict';

    var scrollHeightModule = angular.module('readerApp.directive.scrollHeight', []);

    scrollHeightModule.controller('scrollHeightController', scrollHeightController);

    scrollHeightController.$inject = [];
    function scrollHeightController() {
        var ctrl = this;

        this.active = false;

        /**
         * @description
         * Toggle active state for overflowing content.
         *
         * @param  {Bool} | activeState - does element have a scrollbar.
         * @public
         */
        this.activate = function (activeState) {
            ctrl.active = activeState;
        };

        /**
         * @description
         * Get element's height and scroll height dimensions.
         *
         * @param {Object} | elem - DOM element to get values from.
         * @return {Object}
         * @public
         */
        this.getDimensions = function (elem) {
            return {
                height: elem[0].getBoundingClientRect().height,
                scrollHeight: elem[0].scrollHeight
            };
        };
    }

    scrollHeightModule.directive('scrollHeight', scrollHeight);

    scrollHeight.$inject = ['$window'];
    function scrollHeight($window) {
        return {
            restrict: 'A',
            require: 'scrollHeight',
            scope: {},
            controller: 'scrollHeightController',
            controllerAs: 'shctrl',
            link: function (scope, elem, attrs, ctrl) {
                var w = angular.element($window);

                w.bind('resize', function () {
                    scope.$apply();
                });

                scope.$watch(function () {
                    return ctrl.getDimensions(elem);
                }, function (val) {
                    var activeState = (val.scrollHeight > val.height);
                    ctrl.activate(activeState);
                }, true);

                scope.$on('$destroy', function () {
                    elem.off();
                });
            }
        };
    }

    scrollHeightModule.directive('scrollClass', scrollClass);

    scrollClass.$inject = [];
    function scrollClass() {
        return {
            restrict: 'A',
            require: '^scrollHeight',
            link: function (scope, elem, attrs, ctrl) {
                scope.$watch(function () {
                    return ctrl.active;
                }, function (val) {
                    scope.scrollActive = val;
                });

                scope.$on('$destroy', function () {
                    elem.off();
                });
            }
        };
    }
})();