/**
 * @description
 * Directive for showing images once they're completely loaded.
 */

(function () {
    'use strict';

    var imageLoaderModule = angular.module('readerApp.directive.imageLoader', []);

    imageLoaderModule.directive('imageLoader', imageLoader);

    imageLoader.$inject = [];
    function imageLoader() {
        return {
            restrict: 'A',
            scope: {
                ngShow: '='
            },
            link: function (scope, elem) {
                scope.ngShow = false;
                scope.$watch(function () {
                    return elem[0].complete;
                }, function (val) {
                    if (val) {
                        scope.ngShow = true;
                    }
                });

                scope.$on('$destroy', function () {
                    elem.off();
                });
            }
        };
    }
})();