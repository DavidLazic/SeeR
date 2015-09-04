/**
 * @description
 * Directive for showing images once they're completely loaded.
 */

(function () {
    'use strict';

    var imageLoaderModule = angular.module('readerApp.directive.imageLoader', []);

    imageLoaderModule.controller('imageLoaderController', imageLoaderController);

    imageLoaderController.$inject = ['$scope', '$timeout'];
    function imageLoaderController($scope, $timeout) {

        this.imageSource = null;
        this.timeout = angular.noop;

        /**
         * @description
         * Update image source value.
         *
         * @param {String} | newSource - new image source value.
         * @public
         */
        this.updateImageSource = function (newSource) {
            this.imageSource = newSource;
        };

        /**
         * @description
         * Add class to image's parent DOM element.
         *
         * @param {Object} | image - image DOM element.
         * @public
         */
        this.addClass = function (image) {
            this.timeout = $timeout(function () {
                image.parent().addClass('active');
            }, 1400);
        };

        /**
         * @description
         * Remove class from image's parent DOM element.
         *
         * @param {Object} | imageWrapper - image's wrapper DOM element.
         * @public
         */
        this.removeClass = function (imageWrapper) {
            imageWrapper.removeClass('active');
        };
    }

    imageLoaderModule.directive('imageLoader', imageLoader);

    imageLoader.$inject = ['$timeout'];
    function imageLoader($timeout) {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                source: '@'
            },
            controller: 'imageLoaderController',
            controllerAs: 'ictrl',
            templateUrl: '/app/components/directives/image-loader/image-loader.tpl.html',
            link: function (scope, elem, attrs, ctrl) {
                var imageWrapper = angular.element(elem[0]);

                scope.$watch(function () {
                    return scope.source;
                }, function (newSource) {
                    if (newSource) {
                        ctrl.removeClass(imageWrapper);
                        ctrl.updateImageSource(newSource);
                    }
                });

                scope.$on('$destroy', function () {
                    elem.off();
                    $timeout.cancel(ctrl.timeout);
                });
            }
        };
    }

    imageLoaderModule.directive('imageDelayed', imageDelayed);

    imageDelayed.$inject = [];
    function imageDelayed() {
        return {
            restrict: 'A',
            require: '^imageLoader',
            link: function (scope, elem, attrs, ctrl) {
                var image = angular.element(elem[0]);

                elem.bind('load', function () {
                    ctrl.addClass(image);
                });

                elem.bind('error', function () {
                    alert('no image');
                    // scope.noImage = 'No image';
                });
            }
        };
    }
})();