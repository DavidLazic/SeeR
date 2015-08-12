/**
 * @description
 * Directive for modal comic reader.
 */

(function () {
    'use strict';

    var cReaderModule = angular.module('readerApp.directive.cReader', []);
    cReaderModule.controller('readerController', readerController);

    readerController.$inject = ['$scope'];
    function readerController($scope) {
        var ctrl = this,
            childWidth = 0;

        this.cfg = {
            isWidthSet: false,
            posLeft: 0,
            wrapperWidth: 0
        };

        /**
         * @description
         * Set width of the parent element ("ul").
         */
        this._setWrapperWidth = function () {
            ctrl.cfg.wrapperWidth = [$scope.chapter.length * childWidth, 'px'].join('');
        };

        /**
         * @description
         * Set child element width.
         *
         * @param {Integer}  | width - "li" child element width.
         * @param {Function} | cb - callback function (_setWrapperWidth).
         * @return {Function}
         */
        this._setChildWidth = function (width, cb) {
            childWidth = width;
            ctrl.isWidthSet = true;

            return (angular.isFunction(cb)) ? cb() : angular.noop;
        };

        /**
         * @description
         * Catch only certain key code events.
         *
         * @param  {Object} | event - keydown event.
         * @return {Function}
         */
        this._checkKeyCode = function (event) {
            var keyCodes = {
                37: ctrl._moveLeft,
                39: ctrl._moveRight
            };

            return (keyCodes[event.keyCode]) ? keyCodes[event.keyCode]() : angular.noop;
        };

        this._moveLeft = function () {
            console.log('left');
        };

        this._moveRight = function () {
            console.log('right');
        };
    }

    cReaderModule.directive('cReader', cReader);
    function cReader() {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                chapter: '='
            },
            controller: 'readerController',
            controllerAs: 'rctrl',
            template: '<div class="slider">' +
                        '<ul reader-wrapper style="left: {{rctrl.cfg.posLeft}}; width: {{rctrl.cfg.wrapperWidth}}">' +
                            '<li ng-repeat="image in chapter" child-wrapper>' +
                                '<img ng-src="{{image}}">' +
                            '</li>' +
                        '</ul>' +
                      '</div>'
        };
    }

    cReaderModule.directive('readerWrapper', readerWrapper);
    function readerWrapper() {

        return {
            restrict: 'A',
            require: '^cReader',
            link: function (scope, elem, attrs, ctrl) {
                var $doc = angular.element(document);

                $doc.on('keydown', function (event) {
                    ctrl._checkKeyCode(event);
                });

                scope.$on('$destroy', function (event) {
                    $doc.off();$
                });
            }
        };
    }

    cReaderModule.directive('childWrapper', childWrapper);
    function childWrapper() {

        return {
            restrict: 'A',
            require: '^cReader',
            link: function (scope, elem, attrs, ctrl) {
                if (!ctrl.isWidthSet) {
                    ctrl._setChildWidth(elem[0].getBoundingClientRect().width, function () {
                        ctrl._setWrapperWidth();
                    });
                }
            }
        };
    }
})();