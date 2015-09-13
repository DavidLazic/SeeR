(function() {
    'use strict';

    angular.module('readerApp.directive.menu', [])
    .directive('menu', menu);

    menu.$inject = ['$document'];
    function menu($document) {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/components/directives/menu/menu.tpl.html',
            link: function (scope, elem, attrs, ctrl) {
                var body = angular.element($document[0].body);

                // view model
                scope.isOpen = false;

                // events
                scope.onOpen = onOpen;

                /**
                 * @description
                 * Open menu fn.
                 *
                 * @return void
                 * @public
                 */
                function onOpen () {
                    scope.isOpen = !scope.isOpen;
                    body.toggleClass('-menu-open');
                }
            }
        };
    }
})();