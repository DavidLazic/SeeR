/**
 * @description
 * Directive for modal comic reader.
 */

(function () {
    'use strict';

    var cReaderModule = angular.module('readerApp.directive.cReader', []);
    cReaderModule.controller('readerController', readerController);

    readerController.$inject = ['$scope', '$timeout'];
    function readerController($scope, $timeout) {
        var ctrl = this,
            childWidth = 0;

        this.cfg = {
            isLoading: false,
            isWidthSet: false,
            posLeft: 0,
            wrapperWidth: 0,
            timeout: false
        };

        /**
         * @description
         * Set width of the parent element ("ul").
         */
        this._setWrapperWidth = function () {
            ctrl.cfg.wrapperWidth = [($scope.model.total + 1) * childWidth, 'px'].join('');
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
            if ($scope.model.index > 0 ) {
                --$scope.model.index;
                ctrl.cfg.posLeft = ctrl._getPosition();
            } else if (ctrl._isFirstChapter()) {
                return angular.noop;
            } else {
                ctrl._onResetSlider('previousChapter');
            }
        };

        /**
         * @description
         * Move slider to the right or load next chapter.
         */
        this._onMoveRight = function () {
            if ($scope.model.index < $scope.model.total) {
                ++$scope.model.index;
                ctrl.cfg.posLeft = ctrl._getPosition();
            } else if (ctrl._isLastChapter()) {
                return angular.noop;
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
                ctrl._setLoader();
                type[property](function () {
                    ctrl._resetSlider(function () {
                        ctrl.cfg.timeout = $timeout(function () {
                            ctrl._setLoader();
                        }, 800);
                    });
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
        this._resetSlider = function (cb) {
            $scope.model.index = 0;
            ctrl.cfg.posLeft = 0;
            ctrl._setWrapperWidth();

            return (angular.isFunction(cb)) ? cb() : angular.noop;
        };

        /**
         * @description
         * Set loading status.
         */
        this._setLoader = function () {
            ctrl.cfg.isLoading = !ctrl.cfg.isLoading;
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

        /**
         * @description
         * Check if current chapters is first chapter.
         *
         * @return {Bool}
         */
        this._isFirstChapter = function () {
            return $scope.model.chapterIdx === 0;
        };

        /**
         * @description
         * Check if current chapter is last chapter.
         *
         * @return {Bool}
         */
        this._isLastChapter = function () {
            return $scope.model.chapterIdx === $scope.model.totalChapters;
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
            templateUrl: 'app/components/directives/reader/reader.tpl.html'
        };
    }

    cReaderModule.directive('readerWrapper', readerWrapper);

    readerWrapper.$inject = ['$timeout'];
    function readerWrapper($timeout) {

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
                    $timeout.cancel(ctrl.cfg.timeout);
                });
            }
        };
    }

    cReaderModule.directive('imageWrapper', imageWrapper);

    imageWrapper.$inject = [];
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