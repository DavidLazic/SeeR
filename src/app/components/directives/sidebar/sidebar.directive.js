(function() {
    'use strict';

    angular.module('readerApp.directive.sidebar', [])
    .directive('sidebar', sidebar);

    sidebar.$inject = ['$document'];
    function sidebar($document) {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/components/directives/sidebar/sidebar.tpl.html',
            link: function (scope) {
                var body = angular.element($document[0].body);

                // view model
                scope.url = encodeURIComponent('http://davidlazic.github.io/SeeR/#/');

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
                    body.toggleClass('-menu-open');
                }
            }
        };
    }
})();