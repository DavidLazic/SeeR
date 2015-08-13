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
            currentIndex: 0,
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
                37: ctrl._onMoveLeft,
                39: ctrl._onMoveRight
            };

            return (keyCodes[event.keyCode]) ? keyCodes[event.keyCode]() : angular.noop;
        };

        /**
         * @description
         * Move slider to the left or load previous chapter.
         */
        this._onMoveLeft = function () {
            if (ctrl.cfg.currentIndex > 0) {
                --ctrl.cfg.currentIndex;
                ctrl.cfg.posLeft = ctrl._getPosition();
            } else {
                if ($scope.previousChapter.length) {
                    $scope.chapter = $scope.previousChapter;
                    ctrl._resetSlider();
                }
            }
        };

        /**
         * @description
         * Move slider to the right or load next chapter.
         */
        this._onMoveRight = function () {
            if (ctrl.cfg.currentIndex < $scope.chapter.length - 1) {
                ++ctrl.cfg.currentIndex;
                ctrl.cfg.posLeft = ctrl._getPosition();
            } else {
                if ($scope.nextChapter.length) {
                    $scope.chapter = $scope.nextChapter;
                    ctrl._resetSlider();
                }
            }
        };

        /**
         * @description
         * Get current slider position.
         *
         * @return {String}
         */
        this._getPosition = function () {
            return ['-', 100 * ctrl.cfg.currentIndex, '%'].join('');
        };

        /**
         * @description
         * Reset slider.
         */
        this._resetSlider = function () {
            ctrl.cfg.currentIndex = 0;
            ctrl.cfg.posLeft = 0;
            ctrl._setWrapperWidth();
        };
    }

    cReaderModule.directive('cReader', cReader);
    function cReader() {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                previousChapter: '=',
                chapter: '=',
                nextChapter: '='
            },
            controller: 'readerController',
            controllerAs: 'rctrl',
            template: '<div class="slider">' +
                        '<ul reader-wrapper style="left: {{rctrl.cfg.posLeft}}; width: {{rctrl.cfg.wrapperWidth}}">' +
                            '<li ng-repeat="image in chapter" image-wrapper>' +
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
                    scope.$apply();
                });

                scope.$on('$destroy', function () {
                    $doc.off();
                });
            }
        };
    }

    cReaderModule.directive('imageWrapper', imageWrapper);
    function imageWrapper() {

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