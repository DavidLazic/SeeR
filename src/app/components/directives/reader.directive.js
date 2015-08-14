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
            ctrl.cfg.wrapperWidth = [$scope.model.chapter.length * childWidth, 'px'].join('');
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
            if ($scope.model.index > 0) {
                --$scope.model.index;
                ctrl.cfg.posLeft = ctrl._getPosition();
            } else {
                ctrl._onResetSlider('previousChapter');
            }
        };

        /**
         * @description
         * Move slider to the right or load next chapter.
         */
        this._onMoveRight = function () {
            if ($scope.model.index < $scope.model.chapter.length - 1) {
                ++$scope.model.index;
                ctrl.cfg.posLeft = ctrl._getPosition();
            } else {
                ctrl._onResetSlider('nextChapter');
            }
        };

        /**
         * @description
         * On reset slider.
         *
         * @param  {String} | property - current $scope property.
         */
        this._onResetSlider = function (property) {
            var type = {
                'previousChapter': ctrl._moveLeft,
                'nextChapter': ctrl._moveRight
            };

            if ($scope.model[property].length && type[property]) {
                type[property](function () {
                    ctrl._resetSlider();
                });
            }
        };

        /**
         * @description
         * Move slider to the left and prefetch previous chapter.
         *
         * @return {Function}
         */
        this._moveLeft = function (cb) {
            $scope.model.nextChapter = $scope.model.chapter.slice();
            $scope.model.chapter = $scope.model.previousChapter.slice();
            $scope.onPrev();

            return (angular.isFunction(cb)) ? cb() : angular.noop;
        };

        /**
         * @description
         * Move slider to the right and prefetch next chapter.
         *
         * @return {Function}
         */
        this._moveRight = function (cb) {
            $scope.model.previousChapter = $scope.model.chapter.slice();
            $scope.model.chapter = $scope.model.nextChapter.slice();
            $scope.onNext();

            return (angular.isFunction(cb)) ? cb() : angular.noop;
        };

        /**
         * @description
         * Reset slider.
         */
        this._resetSlider = function () {
            $scope.model.index = 0;
            ctrl.cfg.posLeft = 0;
            ctrl._setWrapperWidth();
        };

        /**
         * @description
         * Get current slider position.
         *
         * @return {String}
         */
        this._getPosition = function () {
            return ['-', 100 * $scope.model.index, '%'].join('');
        };
    }

    cReaderModule.directive('cReader', cReader);
    function cReader() {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                model: '=ngModel',
                onPrev: '&',
                onNext: '&'
            },
            controller: 'readerController',
            controllerAs: 'rctrl',
            template: '<div class="slider">' +
                        '<ul reader-wrapper style="left: {{rctrl.cfg.posLeft}}; width: {{rctrl.cfg.wrapperWidth}}">' +
                            '<li ng-repeat="image in model.chapter track by $index" image-wrapper>' +
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