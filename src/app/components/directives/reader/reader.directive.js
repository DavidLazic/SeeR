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
            timeout: false,
            imageLoaded: false,
            style: 'position: relative'
        };

        /**
         * @description
         * Set width of the parent element ("ul").
         */
        this._setWrapperWidth = function () {
            ctrl.cfg.wrapperWidth = ($scope.model.total + 1) * childWidth + 'px';
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
                37: _onMoveLeft,
                39: _onMoveRight
            };

            return (keyCodes[event.keyCode]) ? keyCodes[event.keyCode]() : angular.noop;
        };

        /**
         * @description
         * Move slider to the left or load previous chapter.
         * @private
         */
        function _onMoveLeft () {
            if ($scope.model.index > 0 ) {
                --$scope.model.index;
                ctrl.cfg.posLeft = _getPosition();
            } else if (_isFirstChapter()) {
                return angular.noop;
            } else {
                _onResetSlider('previousChapter');
            }
        }

        /**
         * @description
         * Move slider to the right or load next chapter.
         * @private
         */
        function _onMoveRight () {
            if ($scope.model.index < $scope.model.total) {
                ++$scope.model.index;
                ctrl.cfg.posLeft = _getPosition();
            } else if (_isLastChapter()) {
                return angular.noop;
            } else {
                _onResetSlider('nextChapter');
            }
        }

        /**
         * @description
         * On reset slider.
         *
         * @param  {String} | property - current $scope property.
         * @private
         */
        function _onResetSlider (property) {
            var type = {
                'previousChapter': _moveLeft,
                'nextChapter': _moveRight
            };

            if ($scope.model[property].length && type[property]) {
                _setLoader();
                type[property](function () {
                    _resetSlider(function () {
                        ctrl.cfg.timeout = $timeout(function () {
                            _setLoader();
                        }, 800);
                    });
                });
            }
        }

        /**
         * @description
         * Move slider to the left and prefetch previous chapter.
         * @private
         *
         * @return {Function}
         */
        function _moveLeft (cb) {
            $scope.model.nextChapter = $scope.model.chapter.slice();
            $scope.model.chapter = $scope.model.previousChapter.slice();
            $scope.onPrev();

            return (angular.isFunction(cb)) ? cb() : angular.noop;
        }

        /**
         * @description
         * Move slider to the right and prefetch next chapter.
         * @private
         *
         * @return {Function}
         */
        function _moveRight (cb) {
            $scope.model.previousChapter = $scope.model.chapter.slice();
            $scope.model.chapter = $scope.model.nextChapter.slice();
            $scope.onNext();

            return (angular.isFunction(cb)) ? cb() : angular.noop;
        }

        /**
         * @description
         * Reset slider.
         * @private
         */
        function _resetSlider (cb) {
            $scope.model.index = 0;
            ctrl.cfg.posLeft = 0;
            ctrl._setWrapperWidth();

            return (angular.isFunction(cb)) ? cb() : angular.noop;
        }

        /**
         * @description
         * Set loading status.
         * @private
         */
        function _setLoader () {
            ctrl.cfg.isLoading = !ctrl.cfg.isLoading;
        }

        /**
         * @description
         * Get current slider position.
         * @private
         *
         * @return {String}
         */
        function _getPosition () {
            return '-' + 100 * $scope.model.index + '%';
        }

        /**
         * @description
         * Check if current chapters is first chapter.
         * @private
         *
         * @return {Bool}
         */
        function _isFirstChapter () {
            return $scope.model.chapterIdx === 0;
        }

        /**
         * @description
         * Check if current chapter is last chapter.
         * @private
         *
         * @return {Bool}
         */
        function _isLastChapter () {
            return $scope.model.chapterIdx === $scope.model.totalChapters;
        }
    }

    cReaderModule.directive('cReader', cReader);

    cReader.$inject = [];
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
                if (!ctrl.cfg.isWidthSet) {
                    ctrl._setChildWidth(elem[0].getBoundingClientRect().width, function () {
                        ctrl._setWrapperWidth();
                    });
                }
            }
        };
    }
})();