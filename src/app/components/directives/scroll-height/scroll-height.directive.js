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
    }

    scrollHeightModule.directive('scrollHeight', scrollHeight);

    scrollHeight.$inject = [];
    function scrollHeight() {
        return {
            restrict: 'A',
            require: 'scrollHeight',
            scope: {},
            controller: 'scrollHeightController',
            controllerAs: 'shctrl',
            link: function (scope, elem, attrs, ctrl) {
                var elemHeight = elem[0].getBoundingClientRect().height;
                scope.$watch(function () {
                    return elem[0].scrollHeight;
                }, function (val) {
                    var activeState = (val > elemHeight);
                    ctrl.activate(activeState);
                });

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