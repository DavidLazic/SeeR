/**
 * @description
 * Directive for showing images once they're completely loaded.
 */

(function () {
    'use strict';

    var imageLoaderModule = angular.module('readerApp.directive.imageLoader', []);

    imageLoaderModule.directive('imageLoader', imageLoader);

    imageLoader.$inject = ['$timeout'];
    function imageLoader($timeout) {
        return {
            restrict: 'A',
            scope: {},
            link: function (scope, elem) {
                scope.$watch(function () {
                    return elem[0].complete;
                }, function (val) {
                    if (val) {
                        var timeout = $timeout(function () {
                            angular.element(elem[0]).parent().addClass('active');
                        }, 1000);

                    }
                });

                scope.$on('$destroy', function () {
                    elem.off();
                    $timeout.off(timeout);
                });
            }
        };
    }
})();