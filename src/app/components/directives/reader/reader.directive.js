/**
 * @description
 * Directive for modal comic reader.
 */

(function () {
    'use strict';

    var cReaderModule = angular.module('readerApp.directive.cReader', []);
    cReaderModule.controller('readerController', readerController);

    readerController.$inject = ['$scope', '$timeout', '$anchorScroll'];
    function readerController($scope, $timeout, $anchorScroll) {
        var ctrl = this,
            childWidth = 0,
            onPrev = $scope.onPrev || angular.noop,
            onNext = $scope.onNext || angular.noop;

        this.isLoading = false;
        this.isWidthSet = false;
        this.posLeft = 0;
        this.wrapperWidth = 0;
        this.timeout = false;
        this.imageLoaded = false;

        /**
         * @description
         * Set width of the parent element ("ul").
         *
         * @public
         */
        this.setWrapperWidth = function () {
            ctrl.wrapperWidth = ($scope.model.total + 1) * childWidth + 'px';
        };

        /**
         * @description
         * Set child element width.
         *
         * @param {Integer}  | width - "li" child element width.
         * @param {Function} | cb - callback function (setWrapperWidth).
         * @return {Function}
         * @public
         */
        this.setChildWidth = function (width, cb) {
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
         * @public
         */
        this.checkKeyCode = function (event) {
            var keyCodes = {
                37: ctrl.onMoveLeft,
                39: ctrl.onMoveRight
            };

            return (keyCodes[event.keyCode]) ? keyCodes[event.keyCode]() : angular.noop;
        };

        /**
         * @description
         * Move slider to the left or load previous chapter.
         *
         * @public
         */
        this.onMoveLeft = function () {
            _scrollTop();
            if ($scope.model.index > 0 ) {
                --$scope.model.index;
                ctrl.posLeft = _getPosition();
            } else if (_isFirstChapter()) {
                return angular.noop;
            } else {
                _onResetSlider('previousChapter');
            }
        };

        /**
         * @description
         * Move slider to the right or load next chapter.
         *
         * @public
         */
        this.onMoveRight = function () {
            _scrollTop();
            if ($scope.model.index < $scope.model.total) {
                ++$scope.model.index;
                ctrl.posLeft = _getPosition();
            } else if (_isLastChapter()) {
                return angular.noop;
            } else {
                _onResetSlider('nextChapter');
            }
        };

        /**
         * @description
         * Scroll to top by using HTML anchor.
         *
         * @return void
         * @private
         */
        function _scrollTop () {
            $anchorScroll('currentPage');
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
                        ctrl.timeout = $timeout(function () {
                            _setLoader();
                        }, 800);
                    });
                });
            }
        }

        /**
         * @description
         * Move slider to the left and prefetch previous chapter.
         *
         * @return {Function}
         * @private
         */
        function _moveLeft (cb) {
            $scope.model.nextChapter = $scope.model.chapter.slice();
            $scope.model.chapter = $scope.model.previousChapter.slice();
            onPrev();

            return (angular.isFunction(cb)) ? cb() : angular.noop;
        }

        /**
         * @description
         * Move slider to the right and prefetch next chapter.
         *
         * @return {Function}
         * @private
         */
        function _moveRight (cb) {
            $scope.model.previousChapter = $scope.model.chapter.slice();
            $scope.model.chapter = $scope.model.nextChapter.slice();
            onNext();

            return (angular.isFunction(cb)) ? cb() : angular.noop;
        }

        /**
         * @description
         * Reset slider.
         *
         * @private
         */
        function _resetSlider (cb) {
            $scope.model.index = 0;
            ctrl.posLeft = 0;
            ctrl.setWrapperWidth();

            return (angular.isFunction(cb)) ? cb() : angular.noop;
        }

        /**
         * @description
         * Set loading status.
         *
         * @private
         */
        function _setLoader () {
            ctrl.isLoading = !ctrl.isLoading;
        }

        /**
         * @description
         * Get current slider position.
         *
         * @return {String}
         * @private
         */
        function _getPosition () {
            return '-' + 100 * $scope.model.index + '%';
        }

        /**
         * @description
         * Check if current chapters is first chapter.
         *
         * @return {Bool}
         * @private
         */
        function _isFirstChapter () {
            return $scope.model.chapterIdx === 0;
        }

        /**
         * @description
         * Check if current chapter is last chapter.
         *
         * @return {Bool}
         * @private
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
                    ctrl.checkKeyCode(event);
                    scope.$apply();
                });

                scope.$on('$destroy', function () {
                    $doc.off();
                    $timeout.cancel(ctrl.timeout);
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
                    ctrl.setChildWidth(elem[0].getBoundingClientRect().width, function () {
                        ctrl.setWrapperWidth();
                    });
                }
            }
        };
    }
})();