/**
 * @description
 * Directive for debouncing function calls.
 */

(function() {
    'use strict';

    var animDebounceModule = angular.module('readerApp.directive.animDebounce', []);

    animDebounceModule.directive('animDebounce', animDebounce);

    animDebounce.$inject = ['$timeout'];
    function animDebounce($timeout) {
        return {
            restrict: 'A',
            scope: {
                delayedFn: '&'
            },
            link: function (scope, elem, attrs) {
                var delayedFn = scope.delayedFn || angular.noop,
                    delay = parseInt(attrs.delay, 10) || 0,
                    timeout = angular.noop;

                timeout = $timeout(function () {
                    delayedFn();
                }, delay);

                scope.$on('$destroy', function () {
                    elem.off();
                    $timeout.cancel(timeout);
                });
            }
        };
    }
})();